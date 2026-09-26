import type {
  RelationshipTuple,
  SubjectReference,
  TupleFilter,
  TupleStore,
} from './types';

const sameObject = (
  left: { type: string; id: string },
  right: { type: string; id: string },
) => left.type === right.type && left.id === right.id;
const sameSubject = (left: SubjectReference, right: SubjectReference) =>
  sameObject(left, right) && left.relation === right.relation;
const sameTuple = (left: RelationshipTuple, right: RelationshipTuple) =>
  sameObject(left.resource, right.resource) &&
  left.relation === right.relation &&
  sameSubject(left.subject, right.subject);
const copyTuple = (tuple: RelationshipTuple): RelationshipTuple => ({
  resource: { ...tuple.resource },
  relation: tuple.relation,
  subject: { ...tuple.subject },
});

export class InMemoryTupleStore implements TupleStore {
  private tuples: RelationshipTuple[];

  constructor(tuples: RelationshipTuple[] = []) {
    this.tuples = [];
    this.write(...tuples);
  }

  async list(filter: TupleFilter = {}): Promise<RelationshipTuple[]> {
    return this.tuples
      .filter(
        (tuple) =>
          (!filter.resource || sameObject(tuple.resource, filter.resource)) &&
          (filter.relation === undefined ||
            tuple.relation === filter.relation) &&
          (!filter.subject || sameSubject(tuple.subject, filter.subject)),
      )
      .map(copyTuple);
  }

  write(...tuples: RelationshipTuple[]): number {
    // ponytail: linear test store; use a database-backed TupleStore for large sets.
    const additions = tuples.filter(
      (tuple, index) =>
        !this.tuples.some((candidate) => sameTuple(candidate, tuple)) &&
        !tuples
          .slice(0, index)
          .some((candidate) => sameTuple(candidate, tuple)),
    );
    this.tuples.push(...additions.map(copyTuple));
    return additions.length;
  }

  delete(...tuples: RelationshipTuple[]): number {
    const before = this.tuples.length;
    this.tuples = this.tuples.filter(
      (candidate) => !tuples.some((tuple) => sameTuple(candidate, tuple)),
    );
    return before - this.tuples.length;
  }
}
