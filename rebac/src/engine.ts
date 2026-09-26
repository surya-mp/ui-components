import {
  getRelationRewrite,
  validateAuthorizationModel,
  validateRelationshipTuple,
} from './model';
import type {
  AuthorizationDecision,
  AuthorizationLimits,
  AuthorizationMetrics,
  AuthorizationModel,
  CheckRequest,
  DecisionTraceNode,
  ObjectReference,
  RebacEngineOptions,
  RelationshipTuple,
  SubjectReference,
  TupleFilter,
  TupleReadOptions,
  TupleStore,
  UsersetRewrite,
} from './types';

const DEFAULT_LIMITS: AuthorizationLimits = {
  maxDepth: 25,
  maxReads: 100,
  maxTuples: 10_000,
  maxEvaluations: 10_000,
};

const sameObject = (left: ObjectReference, right: ObjectReference) =>
  left.type === right.type && left.id === right.id;
const sameSubject = (left: SubjectReference, right: SubjectReference) =>
  sameObject(left, right) && left.relation === right.relation;
const matchesFilter = (tuple: RelationshipTuple, filter: TupleFilter) =>
  (!filter.resource || sameObject(tuple.resource, filter.resource)) &&
  (filter.relation === undefined || tuple.relation === filter.relation) &&
  (!filter.subject || sameSubject(tuple.subject, filter.subject));

type Evaluation = { allowed: boolean; trace?: DecisionTraceNode };
type EvaluationContext = {
  contextualTuples: readonly RelationshipTuple[];
  limits: AuthorizationLimits;
  metrics: AuthorizationMetrics;
  readOptions: TupleReadOptions;
  tracing: boolean;
};

export class AuthorizationError extends Error {
  readonly request: CheckRequest;

  constructor(request: CheckRequest) {
    super('Access denied.');
    this.name = 'AuthorizationError';
    this.request = request;
  }
}

export class AuthorizationLimitError extends Error {
  constructor(
    readonly limit: keyof AuthorizationLimits,
    readonly metrics: AuthorizationMetrics,
  ) {
    super(`Authorization check exceeded ${limit}.`);
    this.name = 'AuthorizationLimitError';
  }
}

export class RebacEngine {
  private readonly limits: AuthorizationLimits;

  constructor(
    private readonly model: AuthorizationModel,
    private readonly store: TupleStore,
    options: RebacEngineOptions = {},
  ) {
    validateAuthorizationModel(model);
    this.limits = this.resolveLimits(options.limits);
  }

  async check(request: CheckRequest): Promise<boolean> {
    return (await this.run(request, false)).allowed;
  }

  async checkWithTrace(request: CheckRequest): Promise<AuthorizationDecision> {
    const result = await this.run(request, true);
    return {
      allowed: result.allowed,
      resource: request.resource,
      permission: request.permission,
      subject: request.subject,
      consistencyToken: request.consistencyToken,
      metrics: result.metrics,
      trace: result.trace,
    };
  }

  async checkMany(requests: readonly CheckRequest[]): Promise<boolean[]> {
    return Promise.all(requests.map((request) => this.check(request)));
  }

  async require(request: CheckRequest): Promise<void> {
    if (!(await this.check(request))) throw new AuthorizationError(request);
  }

  private async run(
    request: CheckRequest,
    tracing: boolean,
  ): Promise<{
    allowed: boolean;
    metrics: AuthorizationMetrics;
    trace: DecisionTraceNode;
  }> {
    const context: EvaluationContext = {
      contextualTuples: request.contextualTuples ?? [],
      limits: this.resolveLimits(request.limits, request.maxDepth),
      metrics: { reads: 0, tuples: 0, evaluations: 0 },
      readOptions: {
        consistencyToken: request.consistencyToken,
        signal: request.signal,
      },
      tracing,
    };
    const result = await this.resolve(
      request.resource,
      request.permission,
      request.subject,
      context.limits.maxDepth,
      new Set(),
      context,
    );
    return {
      allowed: result.allowed,
      metrics: context.metrics,
      trace: result.trace ?? {
        kind: 'relation',
        allowed: result.allowed,
        resource: request.resource,
        relation: request.permission,
      },
    };
  }

  private async resolve(
    resource: ObjectReference,
    relation: string,
    subject: SubjectReference,
    depth: number,
    visited: Set<string>,
    context: EvaluationContext,
  ): Promise<Evaluation> {
    this.throwIfAborted(context);
    this.consume(context, 'evaluations');
    if (depth < 0) {
      throw new AuthorizationLimitError('maxDepth', { ...context.metrics });
    }
    const key = `${resource.type}:${resource.id}#${relation}@${subject.type}:${subject.id}${subject.relation ? `#${subject.relation}` : ''}`;
    if (visited.has(key)) {
      return this.result(context, false, {
        kind: 'cycle',
        allowed: false,
        resource,
        relation,
      });
    }
    const definition = this.model.types[resource.type]?.relations[relation];
    if (!definition) {
      return this.result(context, false, {
        kind: 'missing-relation',
        allowed: false,
        resource,
        relation,
      });
    }
    const nested = await this.evaluate(
      getRelationRewrite(definition),
      resource,
      relation,
      subject,
      depth - 1,
      new Set(visited).add(key),
      context,
    );
    return this.result(context, nested.allowed, {
      kind: 'relation',
      allowed: nested.allowed,
      resource,
      relation,
      children: nested.trace ? [nested.trace] : undefined,
    });
  }

  private async evaluate(
    rewrite: UsersetRewrite,
    resource: ObjectReference,
    relation: string,
    subject: SubjectReference,
    depth: number,
    visited: Set<string>,
    context: EvaluationContext,
  ): Promise<Evaluation> {
    if ('this' in rewrite) {
      const matches = await Promise.all(
        (await this.list({ resource, relation }, context)).map((tuple) =>
          this.matches(tuple, subject, depth, visited, context),
        ),
      );
      const allowed = matches.some((match) => match.allowed);
      return this.result(context, allowed, {
        kind: 'direct',
        allowed,
        resource,
        relation,
        children: matches.flatMap((match) =>
          match.trace ? [match.trace] : [],
        ),
      });
    }
    if ('computedUserset' in rewrite) {
      const nested = await this.resolve(
        resource,
        rewrite.computedUserset,
        subject,
        depth,
        visited,
        context,
      );
      return this.result(context, nested.allowed, {
        kind: 'computed',
        allowed: nested.allowed,
        resource,
        relation: rewrite.computedUserset,
        children: nested.trace ? [nested.trace] : undefined,
      });
    }
    if ('tupleToUserset' in rewrite) {
      const tuples = await this.list(
        { resource, relation: rewrite.tupleToUserset.tupleset },
        context,
      );
      const matches = await Promise.all(
        tuples.map(async (tuple) => {
          const nested = await this.resolve(
            { type: tuple.subject.type, id: tuple.subject.id },
            rewrite.tupleToUserset.computedUserset,
            subject,
            depth,
            visited,
            context,
          );
          return this.result(context, nested.allowed, {
            kind: 'tuple',
            allowed: nested.allowed,
            tuple,
            children: nested.trace ? [nested.trace] : undefined,
          });
        }),
      );
      const allowed = matches.some((match) => match.allowed);
      return this.result(context, allowed, {
        kind: 'tuple-to-userset',
        allowed,
        resource,
        relation: rewrite.tupleToUserset.tupleset,
        children: matches.flatMap((match) =>
          match.trace ? [match.trace] : [],
        ),
      });
    }
    if ('union' in rewrite) {
      const matches = await Promise.all(
        rewrite.union.map((item) =>
          this.evaluate(
            item,
            resource,
            relation,
            subject,
            depth,
            visited,
            context,
          ),
        ),
      );
      const allowed = matches.some((match) => match.allowed);
      return this.result(context, allowed, {
        kind: 'union',
        allowed,
        children: matches.flatMap((match) =>
          match.trace ? [match.trace] : [],
        ),
      });
    }
    if ('intersection' in rewrite) {
      const matches = await Promise.all(
        rewrite.intersection.map((item) =>
          this.evaluate(
            item,
            resource,
            relation,
            subject,
            depth,
            visited,
            context,
          ),
        ),
      );
      const allowed = matches.every((match) => match.allowed);
      return this.result(context, allowed, {
        kind: 'intersection',
        allowed,
        children: matches.flatMap((match) =>
          match.trace ? [match.trace] : [],
        ),
      });
    }
    const base = await this.evaluate(
      rewrite.difference.base,
      resource,
      relation,
      subject,
      depth,
      visited,
      context,
    );
    const subtract = base.allowed
      ? await this.evaluate(
          rewrite.difference.subtract,
          resource,
          relation,
          subject,
          depth,
          visited,
          context,
        )
      : undefined;
    const allowed = base.allowed && !subtract?.allowed;
    return this.result(context, allowed, {
      kind: 'difference',
      allowed,
      children: [base.trace, subtract?.trace].filter(
        (trace): trace is DecisionTraceNode => Boolean(trace),
      ),
    });
  }

  private async matches(
    tuple: RelationshipTuple,
    subject: SubjectReference,
    depth: number,
    visited: Set<string>,
    context: EvaluationContext,
  ): Promise<Evaluation> {
    if (!tuple.subject.relation) {
      const allowed = sameSubject(tuple.subject, subject);
      return this.result(context, allowed, { kind: 'tuple', allowed, tuple });
    }
    const nested = await this.resolve(
      { type: tuple.subject.type, id: tuple.subject.id },
      tuple.subject.relation,
      subject,
      depth,
      visited,
      context,
    );
    return this.result(context, nested.allowed, {
      kind: 'tuple',
      allowed: nested.allowed,
      tuple,
      children: nested.trace ? [nested.trace] : undefined,
    });
  }

  private async list(
    filter: TupleFilter,
    context: EvaluationContext,
  ): Promise<RelationshipTuple[]> {
    this.consume(context, 'reads');
    const stored = await this.store.list(filter, context.readOptions);
    const tuples = [
      ...stored,
      ...context.contextualTuples.filter((tuple) =>
        matchesFilter(tuple, filter),
      ),
    ];
    this.consume(context, 'tuples', tuples.length);
    tuples.forEach((tuple) => validateRelationshipTuple(this.model, tuple));
    return tuples;
  }

  private result(
    context: EvaluationContext,
    allowed: boolean,
    trace: DecisionTraceNode,
  ): Evaluation {
    return { allowed, trace: context.tracing ? trace : undefined };
  }

  private consume(
    context: EvaluationContext,
    metric: keyof AuthorizationMetrics,
    amount = 1,
  ): void {
    const limit =
      metric === 'reads'
        ? context.limits.maxReads
        : metric === 'tuples'
          ? context.limits.maxTuples
          : context.limits.maxEvaluations;
    if (context.metrics[metric] + amount > limit) {
      const limitName =
        metric === 'reads'
          ? 'maxReads'
          : metric === 'tuples'
            ? 'maxTuples'
            : 'maxEvaluations';
      throw new AuthorizationLimitError(limitName, { ...context.metrics });
    }
    context.metrics[metric] += amount;
  }

  private resolveLimits(
    overrides: Partial<AuthorizationLimits> | undefined,
    legacyMaxDepth?: number,
  ): AuthorizationLimits {
    return {
      maxDepth: this.limit(
        legacyMaxDepth ??
          overrides?.maxDepth ??
          this.limits?.maxDepth ??
          DEFAULT_LIMITS.maxDepth,
        'maxDepth',
      ),
      maxReads: this.limit(
        overrides?.maxReads ?? this.limits?.maxReads ?? DEFAULT_LIMITS.maxReads,
        'maxReads',
      ),
      maxTuples: this.limit(
        overrides?.maxTuples ??
          this.limits?.maxTuples ??
          DEFAULT_LIMITS.maxTuples,
        'maxTuples',
      ),
      maxEvaluations: this.limit(
        overrides?.maxEvaluations ??
          this.limits?.maxEvaluations ??
          DEFAULT_LIMITS.maxEvaluations,
        'maxEvaluations',
      ),
    };
  }

  private limit(value: number, name: keyof AuthorizationLimits): number {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new RangeError(`${name} must be a non-negative integer.`);
    }
    return value;
  }

  private throwIfAborted(context: EvaluationContext): void {
    if (context.readOptions.signal?.aborted) {
      throw (
        context.readOptions.signal.reason ??
        new Error('Authorization check aborted.')
      );
    }
  }
}
