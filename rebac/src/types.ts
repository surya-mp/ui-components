export type ObjectReference = { type: string; id: string };
export type SubjectReference = ObjectReference & { relation?: string };
export type RelationshipTuple = {
  resource: ObjectReference;
  relation: string;
  subject: SubjectReference;
};

export type UsersetRewrite =
  | { this: true }
  | { computedUserset: string }
  | { tupleToUserset: { tupleset: string; computedUserset: string } }
  | { union: UsersetRewrite[] }
  | { intersection: UsersetRewrite[] }
  | { difference: { base: UsersetRewrite; subtract: UsersetRewrite } };

export type AuthorizationModel = {
  types: Record<string, { relations: Record<string, UsersetRewrite> }>;
};

export type TupleFilter = {
  resource?: ObjectReference;
  relation?: string;
  subject?: SubjectReference;
};

export type TupleReadOptions = {
  /** An opaque datastore snapshot or consistency token. */
  consistencyToken?: string;
  /** Stops a pending authorization request when supported by the datastore. */
  signal?: AbortSignal;
};

export interface TupleStore {
  list(
    filter?: TupleFilter,
    options?: TupleReadOptions,
  ): Promise<RelationshipTuple[]>;
}

export type CheckRequest = {
  resource: ObjectReference;
  permission: string;
  subject: SubjectReference;
  /** Relationships that apply only to this check and are never persisted. */
  contextualTuples?: readonly RelationshipTuple[];
  /** Passed unchanged to every tuple read made for this check. */
  consistencyToken?: string;
  signal?: AbortSignal;
  maxDepth?: number;
};
