import type {
  RelationshipTuple,
  SubjectReference,
  TupleChange,
  TupleFilter,
  TupleReadOptions,
  TupleWatchOptions,
  WatchableTupleStore,
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
const matchesFilter = (tuple: RelationshipTuple, filter: TupleFilter) =>
  (!filter.resource || sameObject(tuple.resource, filter.resource)) &&
  (filter.relation === undefined || tuple.relation === filter.relation) &&
  (!filter.subject || sameSubject(tuple.subject, filter.subject));
const copyTuple = (tuple: RelationshipTuple): RelationshipTuple => ({
  resource: { ...tuple.resource },
  relation: tuple.relation,
  subject: { ...tuple.subject },
});

export class RevisionUnavailableError extends Error {
  constructor(
    readonly requested: string,
    readonly available: string,
  ) {
    super(
      `Revision ${requested} is not available; current revision is ${available}.`,
    );
    this.name = 'RevisionUnavailableError';
  }
}

export class InMemoryTupleStore implements WatchableTupleStore {
  private tuples: RelationshipTuple[] = [];
  private revision = 0;
  // ponytail: unbounded local history; production stores should retain and compact revisions.
  private changes: TupleChange[] = [];
  private waiters = new Set<() => void>();

  constructor(tuples: RelationshipTuple[] = []) {
    for (const tuple of tuples) {
      if (!this.tuples.some((candidate) => sameTuple(candidate, tuple))) {
        this.tuples.push(copyTuple(tuple));
      }
    }
  }

  async list(
    filter: TupleFilter = {},
    options?: TupleReadOptions,
  ): Promise<RelationshipTuple[]> {
    if (options?.signal?.aborted) {
      throw options.signal.reason ?? new Error('Tuple read aborted.');
    }
    this.assertRevision(options?.consistencyToken);
    return this.tuples
      .filter((tuple) => matchesFilter(tuple, filter))
      .map(copyTuple);
  }

  async getRevision(options?: TupleReadOptions): Promise<string> {
    if (options?.signal?.aborted) {
      throw options.signal.reason ?? new Error('Tuple read aborted.');
    }
    this.assertRevision(options?.consistencyToken);
    return String(this.revision);
  }

  write(...tuples: RelationshipTuple[]): number {
    const additions = tuples.filter(
      (tuple, index) =>
        !this.tuples.some((candidate) => sameTuple(candidate, tuple)) &&
        !tuples
          .slice(0, index)
          .some((candidate) => sameTuple(candidate, tuple)),
    );
    for (const tuple of additions) {
      const copy = copyTuple(tuple);
      this.tuples.push(copy);
      this.record('write', copy);
    }
    return additions.length;
  }

  delete(...tuples: RelationshipTuple[]): number {
    const removals = this.tuples.filter((candidate) =>
      tuples.some((tuple) => sameTuple(candidate, tuple)),
    );
    this.tuples = this.tuples.filter(
      (candidate) => !removals.some((tuple) => sameTuple(candidate, tuple)),
    );
    for (const tuple of removals) this.record('delete', tuple);
    return removals.length;
  }

  async *watch(options: TupleWatchOptions = {}): AsyncIterable<TupleChange> {
    let revision = this.parseRevision(options.after ?? '0');
    while (true) {
      if (options.signal?.aborted) {
        throw options.signal.reason ?? new Error('Tuple watch aborted.');
      }
      const changes = this.changes.filter(
        (change) =>
          this.parseRevision(change.revision) > revision &&
          (!options.filter || matchesFilter(change.tuple, options.filter)),
      );
      if (changes.length > 0) {
        for (const change of changes) {
          revision = this.parseRevision(change.revision);
          yield { ...change, tuple: copyTuple(change.tuple) };
        }
        continue;
      }
      await this.waitForChange(options.signal);
    }
  }

  private record(
    operation: TupleChange['operation'],
    tuple: RelationshipTuple,
  ): void {
    const change: TupleChange = {
      operation,
      tuple: copyTuple(tuple),
      revision: String(++this.revision),
    };
    this.changes.push(change);
    this.waiters.forEach((resolve) => resolve());
    this.waiters.clear();
  }

  private assertRevision(token: string | undefined): void {
    if (token === undefined) return;
    const requested = this.parseRevision(token);
    if (requested > this.revision) {
      throw new RevisionUnavailableError(token, String(this.revision));
    }
  }

  private parseRevision(revision: string): number {
    const parsed = Number.parseInt(revision, 10);
    if (!Number.isSafeInteger(parsed) || parsed < 0) {
      throw new RangeError(
        'InMemoryTupleStore revisions must be non-negative integers.',
      );
    }
    return parsed;
  }

  private waitForChange(signal: AbortSignal | undefined): Promise<void> {
    return new Promise((resolve, reject) => {
      const onChange = () => cleanup(resolve);
      const onAbort = () =>
        cleanup(() =>
          reject(signal?.reason ?? new Error('Tuple watch aborted.')),
        );
      const cleanup = (done: () => void) => {
        this.waiters.delete(onChange);
        signal?.removeEventListener('abort', onAbort);
        done();
      };
      this.waiters.add(onChange);
      signal?.addEventListener('abort', onAbort, { once: true });
    });
  }
}
