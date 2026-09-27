export type ObjectReference = { type: string; id: string };
export type SubjectReference = ObjectReference & { relation?: string };
export type RelationshipTuple = {
  resource: ObjectReference;
  relation: string;
  subject: SubjectReference;
};

export type SubjectTypeConstraint = {
  type: string;
  relation?: string;
};

export type UsersetRewrite =
  | { this: true }
  | { computedUserset: string }
  | { tupleToUserset: { tupleset: string; computedUserset: string } }
  | { union: UsersetRewrite[] }
  | { intersection: UsersetRewrite[] }
  | { difference: { base: UsersetRewrite; subtract: UsersetRewrite } };

export type RelationDefinition =
  | UsersetRewrite
  | {
      rewrite: UsersetRewrite;
      /** Undefined permits legacy unrestricted tuples; an empty array permits none. */
      allowedSubjects?: readonly SubjectTypeConstraint[];
    };

export type AuthorizationModel = {
  types: Record<string, { relations: Record<string, RelationDefinition> }>;
};

export type TupleFilter = {
  resource?: ObjectReference;
  relation?: string;
  subject?: SubjectReference;
};

export type TupleReadOptions = {
  /** An opaque datastore snapshot or consistency token. */
  consistencyToken?: string;
  /** A datastore-level consistency requirement for this read. */
  consistency?: ConsistencyRequirement;
  /** Stops a pending authorization request when supported by the datastore. */
  signal?: AbortSignal;
};

export type ConsistencyMode =
  'minimize-latency' | 'at-least-as-fresh' | 'fully-consistent';

export type ConsistencyRequirement = {
  mode: ConsistencyMode;
  /** Required for at-least-as-fresh reads; opaque to the evaluator. */
  token?: string;
};

export interface TupleStore {
  list(
    filter?: TupleFilter,
    options?: TupleReadOptions,
  ): Promise<RelationshipTuple[]>;
}

export type TupleReadRequest = TupleReadOptions & {
  filter?: TupleFilter;
  pageSize?: number;
  pageToken?: string;
};

export type TupleReadPage = {
  tuples: RelationshipTuple[];
  nextPageToken?: string;
  revision: string;
};

export interface ReadableTupleStore extends TupleStore {
  read(request?: TupleReadRequest): Promise<TupleReadPage>;
}

export interface VersionedTupleStore extends TupleStore {
  getRevision(options?: TupleReadOptions): Promise<string>;
}

export type TuplePrecondition = {
  operation: 'mustMatch' | 'mustNotMatch';
  filter: TupleFilter;
};

export type TupleWriteRequest = TupleReadOptions & {
  writes?: readonly RelationshipTuple[];
  deletes?: readonly RelationshipTuple[];
  preconditions?: readonly TuplePrecondition[];
};

export type TupleWriteResult = {
  revision: string;
  writes: number;
  deletes: number;
};

export interface WritableTupleStore extends VersionedTupleStore {
  write(request: TupleWriteRequest): Promise<TupleWriteResult>;
}

export type TupleChange = {
  operation: 'write' | 'delete';
  tuple: RelationshipTuple;
  revision: string;
};

export type TupleWatchOptions = TupleReadOptions & {
  /** Resume after this revision. */
  after?: string;
  filter?: TupleFilter;
};

export interface WatchableTupleStore extends VersionedTupleStore {
  /** The oldest revision that can be used as a watch resume point. */
  getEarliestRevision(options?: TupleReadOptions): Promise<string>;
  watch(options?: TupleWatchOptions): AsyncIterable<TupleChange>;
}

export type AuthorizationLimits = {
  maxDepth: number;
  maxReads: number;
  maxTuples: number;
  maxEvaluations: number;
};

export type RebacEngineOptions = {
  limits?: Partial<AuthorizationLimits>;
};

export type AuthorizationMetrics = {
  reads: number;
  tuples: number;
  evaluations: number;
};

export type DecisionTraceNode = {
  kind:
    | 'relation'
    | 'direct'
    | 'computed'
    | 'tuple'
    | 'tuple-to-userset'
    | 'union'
    | 'intersection'
    | 'difference'
    | 'cycle'
    | 'missing-relation';
  allowed: boolean;
  resource?: ObjectReference;
  relation?: string;
  tuple?: RelationshipTuple;
  children?: DecisionTraceNode[];
};

export type AuthorizationDecision = {
  allowed: boolean;
  resource: ObjectReference;
  permission: string;
  subject: SubjectReference;
  consistencyToken?: string;
  metrics: AuthorizationMetrics;
  trace: DecisionTraceNode;
};

export type UsersetTreeNode = {
  kind:
    | 'relation'
    | 'direct'
    | 'computed'
    | 'tuple-to-userset'
    | 'union'
    | 'intersection'
    | 'difference'
    | 'cycle'
    | 'missing-relation';
  resource?: ObjectReference;
  relation?: string;
  subjects?: SubjectReference[];
  children?: UsersetTreeNode[];
};

export type ExpandRequest = {
  resource: ObjectReference;
  relation: string;
  contextualTuples?: readonly RelationshipTuple[];
  consistencyToken?: string;
  consistency?: ConsistencyRequirement;
  signal?: AbortSignal;
  maxDepth?: number;
  limits?: Partial<AuthorizationLimits>;
};

export type Expansion = {
  resource: ObjectReference;
  relation: string;
  consistencyToken?: string;
  metrics: AuthorizationMetrics;
  tree: UsersetTreeNode;
};

export type CheckRequest = {
  resource: ObjectReference;
  permission: string;
  subject: SubjectReference;
  /** Relationships that apply only to this check and are never persisted. */
  contextualTuples?: readonly RelationshipTuple[];
  /** Passed unchanged to every tuple read made for this check. */
  consistencyToken?: string;
  consistency?: ConsistencyRequirement;
  signal?: AbortSignal;
  maxDepth?: number;
  limits?: Partial<AuthorizationLimits>;
};
