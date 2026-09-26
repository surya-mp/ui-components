# @sypra-ui/rebac

A small, dependency-free, Zanzibar-inspired relationship-based access-control
engine. It evaluates relationship tuples and userset rewrites; your app owns
identity, storage, tenancy, and request-consistency requirements.

## Install

```sh
pnpm add @sypra-ui/rebac
```

## Define a model and tuples

```ts
import {
  computed,
  from,
  InMemoryTupleStore,
  object,
  RebacEngine,
  subject,
  thisRelation,
  union,
  type AuthorizationModel,
} from '@sypra-ui/rebac';

const model: AuthorizationModel = {
  types: {
    folder: { relations: { viewer: thisRelation() } },
    document: {
      relations: {
        reader: thisRelation(),
        editor: thisRelation(),
        parent: thisRelation(),
        viewer: union(
          computed('reader'),
          computed('editor'),
          from('parent', 'viewer'),
        ),
      },
    },
  },
};

const guide = object('document', 'guide');
const store = new InMemoryTupleStore([
  { resource: guide, relation: 'reader', subject: subject('user', 'anne') },
]);
const rebac = new RebacEngine(model, store);

await rebac.check({
  resource: guide,
  permission: 'viewer',
  subject: subject('user', 'anne'),
}); // true
```

`thisRelation()` evaluates direct tuples. `computed()` references another
relation on the same object. `from()` is Zanzibar's tuple-to-userset pattern;
it follows a related object and evaluates its relation. `union()`,
`intersection()`, and `difference()` compose rewrites.

## Integrate it safely

Construct the engine once during server startup. It validates relation names
and rewrites then, so a misspelled static relation fails fast instead of
silently changing authorization behavior.

Use it at the server decision point. A client-side check can improve the UI,
but it cannot secure an API, database query, or payment action.

```ts
import { AuthorizationError, type CheckRequest } from '@sypra-ui/rebac';

const request: CheckRequest = {
  resource: object('document', `${organizationId}:${documentId}`),
  permission: 'viewer',
  subject: subject('user', session.user.id),
};

try {
  await rebac.require(request);
  // Read or mutate the document here.
} catch (error) {
  if (error instanceof AuthorizationError)
    return new Response(null, { status: 403 });
  throw error;
}
```

Scope object IDs to a tenant (as above), or make the tenant part of every
tuple-store query. Never accept the resource ID or subject ID from a client
without resolving it against the authenticated request.

For a list page, query a bounded candidate set through your application data
layer, then authorize it in parallel:

```ts
const allowed = await rebac.checkMany(
  documents.map((document) => ({
    resource: object('document', `${organizationId}:${document.id}`),
    permission: 'viewer',
    subject: subject('user', session.user.id),
  })),
);
const visibleDocuments = documents.filter((_, index) => allowed[index]);
```

Do not use an unbounded tuple scan as a resource-list endpoint. For large
lists, first filter candidates in the application database and use pagination.

## Bound work and inspect decisions

Every engine has finite defaults: depth `25`, relationship reads `100`, tuples
examined `10,000`, and evaluations `10,000`. Configure tighter limits for an
internet-facing endpoint. A breached limit throws `AuthorizationLimitError`;
treat it as an operational failure, not a normal `403`, because the answer may
be incomplete.

```ts
import { AuthorizationLimitError, RebacEngine } from '@sypra-ui/rebac';

const rebac = new RebacEngine(model, store, {
  limits: { maxReads: 40, maxTuples: 2_000, maxEvaluations: 2_000 },
});

try {
  await rebac.require(request);
} catch (error) {
  if (error instanceof AuthorizationLimitError) {
    return new Response('Authorization temporarily unavailable', {
      status: 503,
    });
  }
  throw error;
}
```

Use `checkWithTrace()` for restricted diagnostics and audit tooling. It returns
the allow/deny result, read/tuple/evaluation metrics, and the relation rewrite
tree that produced the result. A trace includes resource and subject IDs, so do
not return it to an untrusted client.

```ts
const decision = await rebac.checkWithTrace(request);
audit.write({
  action: request.permission,
  allowed: decision.allowed,
  metrics: decision.metrics,
  trace: decision.trace,
});
```

## Constrain relationship tuples

Legacy rewrite-only relations permit any direct subject. Wrap a rewrite with
`relation()` to explicitly allow only the direct subject types your model
expects. An empty list forbids direct tuples entirely.

```ts
import { relation, subjectType, thisRelation } from '@sypra-ui/rebac';

const model = {
  types: {
    group: {
      relations: {
        member: relation(thisRelation(), subjectType('user')),
      },
    },
    document: {
      relations: {
        reader: relation(
          thisRelation(),
          subjectType('user'),
          subjectType('group', 'member'),
        ),
      },
    },
  },
};
```

The engine validates every tuple it reads, including contextual tuples. Call
`validateRelationshipTuple(model, tuple)` in the application's write
transaction too, so invalid data never enters durable storage.

## Production tuple store

Implement `TupleStore` over the application's database. The engine passes the
same opaque `consistencyToken` and `AbortSignal` to every relationship read in
one check; map the token to the datastore snapshot, replica, or transaction
your application uses.

```ts
import type {
  RelationshipTuple,
  TupleFilter,
  TupleReadOptions,
  TupleStore,
} from '@sypra-ui/rebac';

const store: TupleStore = {
  async list(
    filter: TupleFilter = {},
    options: TupleReadOptions = {},
  ): Promise<RelationshipTuple[]> {
    return database.relationships.list({
      ...filter,
      tenantId: organizationId,
      snapshot: options.consistencyToken,
      signal: options.signal,
    });
  },
};
```

`contextualTuples` can add request-only facts without persisting them—for
example, a relationship verified by an upstream system during the same
request. They only grant access for that individual check.

```ts
await rebac.check({
  resource: guide,
  permission: 'reader',
  subject: subject('user', 'anne'),
  contextualTuples: [
    { resource: guide, relation: 'reader', subject: subject('user', 'anne') },
  ],
});
```

## Revisions and change watches

`VersionedTupleStore` adds `getRevision()`. `WatchableTupleStore` adds an async
`watch()` stream of writes and deletes. `InMemoryTupleStore` implements both
for tests and local tools; its numeric revisions are not distributed tokens.

```ts
const revision = await store.getRevision();

for await (const change of store.watch({ after: revision })) {
  invalidateAuthorizationCache(change.tuple.resource);
}
```

For a real datastore, make `consistencyToken` refer to a readable snapshot and
make `watch({ after })` resume from an ordered durable change stream. The core
evaluator passes the same token to every tuple read in a decision. This is the
integration boundary for Zanzibar-style revision handling; multi-region
replication, retention, conflict resolution, and read-after-write guarantees
remain the responsibility of the backing authorization service or datastore.

`InMemoryTupleStore` is deterministic, idempotently writes equivalent tuples,
and is intended for tests, local tools, and examples. Keep durable tuple
writes, audit records, and transaction boundaries in the application. Cache
authorization decisions only when tuple changes reliably invalidate the cache.

This package is an evaluator, not a distributed Zanzibar service or an identity
provider. Applications own durable tuple storage, request consistency, and
identity verification.
