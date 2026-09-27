import type {
  ReadableTupleStore,
  RelationshipTuple,
  SubjectReference,
  TupleChange,
  TupleFilter,
  TuplePrecondition,
  TupleReadOptions,
  TupleReadPage,
  TupleReadRequest,
  TupleWatchOptions,
  TupleWriteRequest,
  TupleWriteResult,
  WatchableTupleStore,
  WritableTupleStore,
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

export class RevisionExpiredError extends Error {
  constructor(
    readonly requested: string,
    readonly earliestAvailable: string,
  ) {
    super(
      `Revision ${requested} has expired; resume from ${earliestAvailable} or later.`,
    );
    this.name = 'RevisionExpiredError';
  }
}

export class TuplePreconditionError extends Error {
  constructor(readonly precondition: TuplePrecondition) {
    super(`Tuple precondition ${precondition.operation} failed.`);
    this.name = 'TuplePreconditionError';
  }
}

export class ConsistencyRequirementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConsistencyRequirementError';
  }
}

export type InMemoryTupleStoreOptions = {
  /** Number of change events retained for resumable watches. */
  historyLimit?: number;
};

export class InMemoryTupleStore
  implements ReadableTupleStore, WritableTupleStore, WatchableTupleStore
{
  private tuples: RelationshipTuple[] = [];
  private revision = 0;
  // ponytail: process-local history; use a durable change log for production watches.
  private changes: TupleChange[] = [];
  private waiters = new Set<() => void>();
  private readonly historyLimit: number;

  constructor(
    tuples: RelationshipTuple[] = [],
    options: InMemoryTupleStoreOptions = {},
  ) {
    this.historyLimit = options.historyLimit ?? Number.POSITIVE_INFINITY;
    if (
      (!Number.isSafeInteger(this.historyLimit) &&
        this.historyLimit !== Infinity) ||
      this.historyLimit < 0
    ) {
      throw new RangeError('historyLimit must be a non-negative integer.');
    }
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
    this.assertReadable(options);
    return this.tuples
      .filter((tuple) => matchesFilter(tuple, filter))
      .map(copyTuple);
  }

  async read(request: TupleReadRequest = {}): Promise<TupleReadPage> {
    this.assertReadable(request);
    const pageSize = request.pageSize ?? 100;
    if (!Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 1_000) {
      throw new RangeError('pageSize must be an integer between 1 and 1000.');
    }
    const page = request.pageToken
      ? this.parsePageToken(request.pageToken)
      : { revision: this.revision, offset: 0 };
    if (page.revision !== this.revision) {
      throw new RevisionUnavailableError(
        String(page.revision),
        String(this.revision),
      );
    }
    const tuples = this.tuples.filter((tuple) =>
      matchesFilter(tuple, request.filter ?? {}),
    );
    const nextOffset = page.offset + pageSize;
    return {
      tuples: tuples.slice(page.offset, nextOffset).map(copyTuple),
      ...(nextOffset < tuples.length
        ? { nextPageToken: `${this.revision}:${nextOffset}` }
        : {}),
      revision: String(this.revision),
    };
  }

  async getRevision(options?: TupleReadOptions): Promise<string> {
    this.assertReadable(options);
    return String(this.revision);
  }

  async getEarliestRevision(options?: TupleReadOptions): Promise<string> {
    this.assertReadable(options);
    const first = this.changes[0];
    return String(
      first ? this.parseRevision(first.revision) - 1 : this.revision,
    );
  }

  async write(request: TupleWriteRequest): Promise<TupleWriteResult> {
    this.assertReadable(request);
    for (const precondition of request.preconditions ?? []) {
      const matches = this.tuples.some((tuple) =>
        matchesFilter(tuple, precondition.filter),
      );
      if (
        (precondition.operation === 'mustMatch' && !matches) ||
        (precondition.operation === 'mustNotMatch' && matches)
      ) {
        throw new TuplePreconditionError(precondition);
      }
    }
    const writes = (request.writes ?? []).filter(
      (tuple, index, tuples) =>
        !this.tuples.some((candidate) => sameTuple(candidate, tuple)) &&
        !tuples
          .slice(0, index)
          .some((candidate) => sameTuple(candidate, tuple)),
    );
    const deletes = this.tuples.filter((candidate) =>
      (request.deletes ?? []).some((tuple) => sameTuple(candidate, tuple)),
    );
    if (writes.length === 0 && deletes.length === 0) {
      return { revision: String(this.revision), writes: 0, deletes: 0 };
    }
    this.tuples = [
      ...this.tuples.filter(
        (candidate) => !deletes.some((tuple) => sameTuple(candidate, tuple)),
      ),
      ...writes.map(copyTuple),
    ];
    this.record([
      ...writes.map((tuple) => ({ operation: 'write' as const, tuple })),
      ...deletes.map((tuple) => ({ operation: 'delete' as const, tuple })),
    ]);
    return {
      revision: String(this.revision),
      writes: writes.length,
      deletes: deletes.length,
    };
  }

  async *watch(options: TupleWatchOptions = {}): AsyncIterable<TupleChange> {
    this.assertReadable(options);
    let revision = this.parseRevision(
      options.after ?? options.consistency?.token ?? '0',
    );
    const earliest = this.parseRevision(
      await this.getEarliestRevision(options),
    );
    if (revision < earliest) {
      throw new RevisionExpiredError(String(revision), String(earliest));
    }
    while (true) {
      if (options.signal?.aborted) {
        throw options.signal.reason ?? new Error('Tuple watch aborted.');
      }
      const pending = this.changes.filter(
        (change) => this.parseRevision(change.revision) > revision,
      );
      if (pending.length > 0) {
        revision = this.parseRevision(pending[pending.length - 1]!.revision);
        for (const change of pending) {
          if (!options.filter || matchesFilter(change.tuple, options.filter)) {
            yield { ...change, tuple: copyTuple(change.tuple) };
          }
        }
        continue;
      }
      await this.waitForChange(options.signal);
    }
  }

  private record(
    changes: Array<Pick<TupleChange, 'operation' | 'tuple'>>,
  ): void {
    const revision = String(++this.revision);
    this.changes.push(
      ...changes.map((change) => ({
        ...change,
        tuple: copyTuple(change.tuple),
        revision,
      })),
    );
    if (this.changes.length > this.historyLimit) {
      this.changes.splice(0, this.changes.length - this.historyLimit);
    }
    this.waiters.forEach((resolve) => resolve());
    this.waiters.clear();
  }

  private assertReadable(options: TupleReadOptions | undefined): void {
    if (options?.signal?.aborted) {
      throw options.signal.reason ?? new Error('Tuple read aborted.');
    }
    if (
      options?.consistency?.mode === 'at-least-as-fresh' &&
      !options.consistency.token
    ) {
      throw new ConsistencyRequirementError(
        'at-least-as-fresh reads require a consistency token.',
      );
    }
    this.assertRevision(
      options?.consistency?.token ?? options?.consistencyToken,
    );
  }

  private assertRevision(token: string | undefined): void {
    if (token === undefined) return;
    const requested = this.parseRevision(token);
    if (requested > this.revision) {
      throw new RevisionUnavailableError(token, String(this.revision));
    }
  }

  private parsePageToken(token: string): { revision: number; offset: number } {
    const [revision, offset, extra] = token.split(':');
    if (extra !== undefined || revision === undefined || offset === undefined) {
      throw new RangeError('Invalid page token.');
    }
    return {
      revision: this.parseRevision(revision),
      offset: this.parseRevision(offset),
    };
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
