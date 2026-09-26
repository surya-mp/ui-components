import type {
  AuthorizationModel,
  CheckRequest,
  ObjectReference,
  RelationshipTuple,
  SubjectReference,
  TupleFilter,
  TupleReadOptions,
  TupleStore,
  UsersetRewrite,
} from './types';
import { validateAuthorizationModel } from './model';

const sameObject = (left: ObjectReference, right: ObjectReference) =>
  left.type === right.type && left.id === right.id;
const sameSubject = (left: SubjectReference, right: SubjectReference) =>
  sameObject(left, right) && left.relation === right.relation;
const matchesFilter = (tuple: RelationshipTuple, filter: TupleFilter) =>
  (!filter.resource || sameObject(tuple.resource, filter.resource)) &&
  (filter.relation === undefined || tuple.relation === filter.relation) &&
  (!filter.subject || sameSubject(tuple.subject, filter.subject));

type EvaluationContext = {
  contextualTuples: readonly RelationshipTuple[];
  readOptions: TupleReadOptions;
};

export class AuthorizationError extends Error {
  readonly request: CheckRequest;

  constructor(request: CheckRequest) {
    super('Access denied.');
    this.name = 'AuthorizationError';
    this.request = request;
  }
}

export class RebacEngine {
  constructor(
    private readonly model: AuthorizationModel,
    private readonly store: TupleStore,
  ) {
    validateAuthorizationModel(model);
  }

  async check(request: CheckRequest): Promise<boolean> {
    const { resource, permission, subject, maxDepth = 25 } = request;
    return this.resolve(resource, permission, subject, maxDepth, new Set(), {
      contextualTuples: request.contextualTuples ?? [],
      readOptions: {
        consistencyToken: request.consistencyToken,
        signal: request.signal,
      },
    });
  }

  async checkMany(requests: readonly CheckRequest[]): Promise<boolean[]> {
    return Promise.all(requests.map((request) => this.check(request)));
  }

  async require(request: CheckRequest): Promise<void> {
    if (!(await this.check(request))) throw new AuthorizationError(request);
  }

  private async resolve(
    resource: ObjectReference,
    relation: string,
    subject: SubjectReference,
    depth: number,
    visited: Set<string>,
    context: EvaluationContext,
  ): Promise<boolean> {
    if (context.readOptions.signal?.aborted) {
      throw (
        context.readOptions.signal.reason ??
        new Error('Authorization check aborted.')
      );
    }
    if (depth < 0) return false;
    const key = `${resource.type}:${resource.id}#${relation}@${subject.type}:${subject.id}${subject.relation ? `#${subject.relation}` : ''}`;
    if (visited.has(key)) return false;
    const definition = this.model.types[resource.type]?.relations[relation];
    if (!definition) return false;
    const nextVisited = new Set(visited).add(key);
    return this.evaluate(
      definition,
      resource,
      relation,
      subject,
      depth - 1,
      nextVisited,
      context,
    );
  }

  private async evaluate(
    rewrite: UsersetRewrite,
    resource: ObjectReference,
    relation: string,
    subject: SubjectReference,
    depth: number,
    visited: Set<string>,
    context: EvaluationContext,
  ): Promise<boolean> {
    if ('this' in rewrite) {
      const tuples = await this.list({ resource, relation }, context);
      return (
        await Promise.all(
          tuples.map((tuple) =>
            this.matches(tuple.subject, subject, depth, visited, context),
          ),
        )
      ).some(Boolean);
    }
    if ('computedUserset' in rewrite)
      return this.resolve(
        resource,
        rewrite.computedUserset,
        subject,
        depth,
        visited,
        context,
      );
    if ('tupleToUserset' in rewrite) {
      const tuples = await this.list(
        {
          resource,
          relation: rewrite.tupleToUserset.tupleset,
        },
        context,
      );
      return (
        await Promise.all(
          tuples.map((tuple) =>
            this.resolve(
              { type: tuple.subject.type, id: tuple.subject.id },
              rewrite.tupleToUserset.computedUserset,
              subject,
              depth,
              visited,
              context,
            ),
          ),
        )
      ).some(Boolean);
    }
    if ('union' in rewrite)
      return (
        await Promise.all(
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
        )
      ).some(Boolean);
    if ('intersection' in rewrite)
      return (
        await Promise.all(
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
        )
      ).every(Boolean);
    return (
      (await this.evaluate(
        rewrite.difference.base,
        resource,
        relation,
        subject,
        depth,
        visited,
        context,
      )) &&
      !(await this.evaluate(
        rewrite.difference.subtract,
        resource,
        relation,
        subject,
        depth,
        visited,
        context,
      ))
    );
  }

  private async matches(
    granted: SubjectReference,
    subject: SubjectReference,
    depth: number,
    visited: Set<string>,
    context: EvaluationContext,
  ): Promise<boolean> {
    if (!granted.relation) return sameSubject(granted, subject);
    return this.resolve(
      granted,
      granted.relation,
      subject,
      depth,
      visited,
      context,
    );
  }

  private async list(
    filter: TupleFilter,
    context: EvaluationContext,
  ): Promise<RelationshipTuple[]> {
    const stored = await this.store.list(filter, context.readOptions);
    return [
      ...stored,
      ...context.contextualTuples.filter((tuple) =>
        matchesFilter(tuple, filter),
      ),
    ];
  }
}
