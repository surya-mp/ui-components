import { describe, expect, it } from 'vitest';
import {
  AuthorizationError,
  AuthorizationLimitError,
  computed,
  difference,
  from,
  InMemoryTupleStore,
  intersection,
  object,
  RebacEngine,
  RelationshipTupleError,
  RevisionUnavailableError,
  relation,
  subject,
  subjectType,
  thisRelation,
  union,
  validateAuthorizationModel,
  type AuthorizationModel,
  type TupleReadOptions,
  type TupleStore,
} from './index';

const model: AuthorizationModel = {
  types: {
    group: { relations: { member: thisRelation() } },
    folder: { relations: { viewer: thisRelation() } },
    document: {
      relations: {
        reader: thisRelation(),
        editor: thisRelation(),
        approved: thisRelation(),
        parent: thisRelation(),
        blocked: thisRelation(),
        manager: intersection(computed('editor'), computed('approved')),
        viewer: difference(
          union(
            computed('reader'),
            computed('editor'),
            from('parent', 'viewer'),
          ),
          computed('blocked'),
        ),
      },
    },
  },
};

describe('RebacEngine', () => {
  it('resolves direct, group, computed, tuple-to-userset, and difference rewrites', async () => {
    const anne = subject('user', 'anne');
    const bob = subject('user', 'bob');
    const document = object('document', 'guide');
    const store = new InMemoryTupleStore([
      {
        resource: object('group', 'engineering'),
        relation: 'member',
        subject: anne,
      },
      {
        resource: document,
        relation: 'reader',
        subject: subject('group', 'engineering', 'member'),
      },
      { resource: document, relation: 'editor', subject: bob },
      { resource: document, relation: 'approved', subject: bob },
      {
        resource: document,
        relation: 'parent',
        subject: object('folder', 'handbook'),
      },
      {
        resource: object('folder', 'handbook'),
        relation: 'viewer',
        subject: subject('user', 'casey'),
      },
      { resource: document, relation: 'blocked', subject: bob },
    ]);
    const engine = new RebacEngine(model, store);

    await expect(
      engine.check({ resource: document, permission: 'editor', subject: anne }),
    ).resolves.toBe(false);
    await expect(
      engine.check({ resource: document, permission: 'manager', subject: bob }),
    ).resolves.toBe(true);
    await expect(
      engine.check({ resource: document, permission: 'viewer', subject: anne }),
    ).resolves.toBe(true);
    await expect(
      engine.check({
        resource: document,
        permission: 'viewer',
        subject: subject('user', 'casey'),
      }),
    ).resolves.toBe(true);
    await expect(
      engine.check({ resource: document, permission: 'viewer', subject: bob }),
    ).resolves.toBe(false);
    await expect(
      engine.check({
        resource: document,
        permission: 'viewer',
        subject: subject('user', 'drew'),
      }),
    ).resolves.toBe(false);
  });

  it('stops cyclic usersets instead of granting access', async () => {
    const cyclicModel: AuthorizationModel = {
      types: {
        folder: {
          relations: {
            parent: thisRelation(),
            viewer: from('parent', 'viewer'),
          },
        },
      },
    };
    const store = new InMemoryTupleStore([
      {
        resource: object('folder', 'a'),
        relation: 'parent',
        subject: object('folder', 'b'),
      },
      {
        resource: object('folder', 'b'),
        relation: 'parent',
        subject: object('folder', 'a'),
      },
    ]);
    await expect(
      new RebacEngine(cyclicModel, store).check({
        resource: object('folder', 'a'),
        permission: 'viewer',
        subject: subject('user', 'anne'),
      }),
    ).resolves.toBe(false);
  });

  it('supports contextual tuples, bulk checks, and server-side enforcement', async () => {
    const document = object('document', 'draft');
    const engine = new RebacEngine(model, new InMemoryTupleStore());
    const anne = subject('user', 'anne');

    await expect(
      engine.check({
        resource: document,
        permission: 'reader',
        subject: anne,
        contextualTuples: [
          { resource: document, relation: 'reader', subject: anne },
        ],
      }),
    ).resolves.toBe(true);
    await expect(
      engine.checkMany([
        {
          resource: document,
          permission: 'reader',
          subject: anne,
          contextualTuples: [
            { resource: document, relation: 'reader', subject: anne },
          ],
        },
        {
          resource: document,
          permission: 'reader',
          subject: subject('user', 'drew'),
        },
      ]),
    ).resolves.toEqual([true, false]);
    await expect(
      engine.require({
        resource: document,
        permission: 'reader',
        subject: anne,
      }),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });

  it('validates models and gives the in-memory store value semantics', async () => {
    expect(() =>
      validateAuthorizationModel({
        types: {
          document: { relations: { viewer: computed('missing') } },
        },
      }),
    ).toThrow('unknown relation');

    const tuple = {
      resource: object('document', 'guide'),
      relation: 'reader',
      subject: subject('user', 'anne'),
    };
    const store = new InMemoryTupleStore([tuple, { ...tuple }]);
    expect(store.write({ ...tuple, resource: { ...tuple.resource } })).toBe(0);
    await expect(store.list()).resolves.toHaveLength(1);
    const listed = await store.list();
    listed[0]!.subject.id = 'changed';
    await expect(
      store.list({ subject: subject('user', 'anne') }),
    ).resolves.toHaveLength(1);
    expect(store.delete({ ...tuple, subject: { ...tuple.subject } })).toBe(1);
  });

  it('passes a request consistency token and cancellation signal to the tuple store', async () => {
    const reads: (TupleReadOptions | undefined)[] = [];
    const store: TupleStore = {
      async list(filter, options) {
        void filter;
        reads.push(options);
        return [
          {
            resource: object('document', 'guide'),
            relation: 'reader',
            subject: subject('user', 'anne'),
          },
        ];
      },
    };
    const controller = new AbortController();
    const engine = new RebacEngine(model, store);

    await expect(
      engine.check({
        resource: object('document', 'guide'),
        permission: 'reader',
        subject: subject('user', 'anne'),
        consistencyToken: 'snapshot-42',
        signal: controller.signal,
      }),
    ).resolves.toBe(true);
    expect(reads).toEqual([
      { consistencyToken: 'snapshot-42', signal: controller.signal },
    ]);
  });

  it('fails explicitly when a check exceeds its configured work budget', async () => {
    const engine = new RebacEngine(model, new InMemoryTupleStore(), {
      limits: { maxReads: 0 },
    });

    await expect(
      engine.check({
        resource: object('document', 'guide'),
        permission: 'reader',
        subject: subject('user', 'anne'),
      }),
    ).rejects.toMatchObject({
      limit: 'maxReads',
      name: AuthorizationLimitError.name,
    });
  });

  it('returns a structured trace and metrics without changing the decision', async () => {
    const document = object('document', 'guide');
    const engine = new RebacEngine(
      model,
      new InMemoryTupleStore([
        {
          resource: document,
          relation: 'reader',
          subject: subject('user', 'anne'),
        },
      ]),
    );

    const decision = await engine.checkWithTrace({
      resource: document,
      permission: 'viewer',
      subject: subject('user', 'anne'),
    });

    expect(decision.allowed).toBe(true);
    expect(decision.metrics.reads).toBeGreaterThan(0);
    expect(decision.trace).toMatchObject({
      kind: 'relation',
      relation: 'viewer',
      allowed: true,
    });
  });

  it('enforces relationship schemas for persisted and contextual tuples', async () => {
    const constrainedModel: AuthorizationModel = {
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
    const document = object('document', 'guide');
    const engine = new RebacEngine(constrainedModel, new InMemoryTupleStore());

    await expect(
      engine.check({
        resource: document,
        permission: 'reader',
        subject: subject('user', 'anne'),
        contextualTuples: [
          {
            resource: document,
            relation: 'reader',
            subject: subject('service', 'importer'),
          },
        ],
      }),
    ).rejects.toBeInstanceOf(RelationshipTupleError);
  });

  it('supports revisions and tuple watches for change-driven integrations', async () => {
    const store = new InMemoryTupleStore();
    const revision = await store.getRevision();
    const iterator = store.watch({ after: revision })[Symbol.asyncIterator]();
    const nextChange = iterator.next();
    const tuple = {
      resource: object('document', 'guide'),
      relation: 'reader',
      subject: subject('user', 'anne'),
    };
    store.write(tuple);

    await expect(nextChange).resolves.toMatchObject({
      done: false,
      value: { operation: 'write', revision: '1', tuple },
    });
    await expect(
      store.list({}, { consistencyToken: '2' }),
    ).rejects.toBeInstanceOf(RevisionUnavailableError);
    await iterator.return?.();
  });
});
