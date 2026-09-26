import type {
  AuthorizationModel,
  ObjectReference,
  RelationDefinition,
  RelationshipTuple,
  SubjectTypeConstraint,
  SubjectReference,
  UsersetRewrite,
} from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const hasName = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export class AuthorizationModelError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationModelError';
  }
}

export class RelationshipTupleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RelationshipTupleError';
  }
}

export const validateAuthorizationModel = (model: AuthorizationModel): void => {
  const types = model?.types;
  if (!isRecord(types)) {
    throw new AuthorizationModelError('Model types must be an object.');
  }

  for (const [typeName, typeDefinition] of Object.entries(types)) {
    if (!hasName(typeName) || !isRecord(typeDefinition)) {
      throw new AuthorizationModelError('Each model type must be named.');
    }
    const relations = typeDefinition.relations;
    if (!isRecord(relations)) {
      throw new AuthorizationModelError(
        `Type "${typeName}" must define a relations object.`,
      );
    }
    for (const [relation, definition] of Object.entries(relations)) {
      if (!hasName(relation)) {
        throw new AuthorizationModelError(
          `Type "${typeName}" has an unnamed relation.`,
        );
      }
      validateRelationDefinition(
        definition,
        typeName,
        relation,
        relations,
        types,
      );
    }
  }
};

const validateRelationDefinition = (
  definition: unknown,
  typeName: string,
  relation: string,
  relations: Record<string, unknown>,
  types: Record<string, unknown>,
): void => {
  const rewrite = getRelationRewrite(definition as RelationDefinition);
  validateRewrite(rewrite, typeName, relation, relations);

  if (!isRecord(definition) || !Object.hasOwn(definition, 'rewrite')) return;
  if (
    Object.keys(definition).some(
      (key) => key !== 'rewrite' && key !== 'allowedSubjects',
    )
  ) {
    throw new AuthorizationModelError(
      `Relation "${typeName}.${relation}" has unsupported options.`,
    );
  }
  if (
    definition.allowedSubjects !== undefined &&
    !Array.isArray(definition.allowedSubjects)
  ) {
    throw new AuthorizationModelError(
      `Relation "${typeName}.${relation}" must use an array of allowed subjects.`,
    );
  }
  for (const allowed of definition.allowedSubjects ?? []) {
    if (!isRecord(allowed) || !hasName(allowed.type)) {
      throw new AuthorizationModelError(
        `Relation "${typeName}.${relation}" has an invalid allowed subject.`,
      );
    }
    if (allowed.relation === undefined) continue;
    const allowedType = types[allowed.type];
    if (!hasName(allowed.relation) || !isRecord(allowedType)) {
      throw new AuthorizationModelError(
        `Relation "${typeName}.${relation}" references an invalid userset subject.`,
      );
    }
    const allowedRelations = allowedType.relations;
    if (
      !isRecord(allowedRelations) ||
      !Object.hasOwn(allowedRelations, allowed.relation)
    ) {
      throw new AuthorizationModelError(
        `Relation "${typeName}.${relation}" references unknown userset "${allowed.type}#${allowed.relation}".`,
      );
    }
  }
};

export const getRelationRewrite = (
  definition: RelationDefinition,
): UsersetRewrite =>
  isRecord(definition) && Object.hasOwn(definition, 'rewrite')
    ? ((definition as Record<string, unknown>).rewrite as UsersetRewrite)
    : (definition as UsersetRewrite);

export const getAllowedSubjects = (
  definition: RelationDefinition,
): readonly SubjectTypeConstraint[] | undefined =>
  isRecord(definition) && Object.hasOwn(definition, 'rewrite')
    ? ((definition as Record<string, unknown>).allowedSubjects as
        readonly SubjectTypeConstraint[] | undefined)
    : undefined;

export const validateRelationshipTuple = (
  model: AuthorizationModel,
  tuple: RelationshipTuple,
): void => {
  const resourceType = model.types[tuple.resource.type];
  if (!resourceType) {
    throw new RelationshipTupleError(
      `Tuple references unknown resource type "${tuple.resource.type}".`,
    );
  }
  const definition = resourceType.relations[tuple.relation];
  if (!definition) {
    throw new RelationshipTupleError(
      `Tuple references unknown relation "${tuple.resource.type}.${tuple.relation}".`,
    );
  }
  const allowedSubjects = getAllowedSubjects(definition);
  if (allowedSubjects === undefined) return;
  if (
    !allowedSubjects.some(
      (allowed) =>
        allowed.type === tuple.subject.type &&
        allowed.relation === tuple.subject.relation,
    )
  ) {
    throw new RelationshipTupleError(
      `Tuple subject "${tuple.subject.type}${tuple.subject.relation ? `#${tuple.subject.relation}` : ''}" is not allowed for "${tuple.resource.type}.${tuple.relation}".`,
    );
  }
};

const validateRewrite = (
  rewrite: unknown,
  typeName: string,
  relation: string,
  relations: Record<string, unknown>,
): void => {
  const location = `Relation "${typeName}.${relation}"`;
  if (!isRecord(rewrite)) {
    throw new AuthorizationModelError(`${location} must define a rewrite.`);
  }
  if (rewrite.this === true && Object.keys(rewrite).length === 1) return;
  if (hasName(rewrite.computedUserset) && Object.keys(rewrite).length === 1) {
    if (!Object.hasOwn(relations, rewrite.computedUserset)) {
      throw new AuthorizationModelError(
        `${location} references unknown relation "${rewrite.computedUserset}".`,
      );
    }
    return;
  }
  if (isRecord(rewrite.tupleToUserset) && Object.keys(rewrite).length === 1) {
    const { tupleset, computedUserset } = rewrite.tupleToUserset;
    if (!hasName(tupleset) || !hasName(computedUserset)) {
      throw new AuthorizationModelError(
        `${location} has an invalid tuple-to-userset rewrite.`,
      );
    }
    if (!Object.hasOwn(relations, tupleset)) {
      throw new AuthorizationModelError(
        `${location} references unknown tupleset "${tupleset}".`,
      );
    }
    return;
  }
  if (Array.isArray(rewrite.union) && Object.keys(rewrite).length === 1) {
    if (rewrite.union.length === 0) {
      throw new AuthorizationModelError(
        `${location} cannot have an empty union.`,
      );
    }
    rewrite.union.forEach((item) =>
      validateRewrite(item, typeName, relation, relations),
    );
    return;
  }
  if (
    Array.isArray(rewrite.intersection) &&
    Object.keys(rewrite).length === 1
  ) {
    if (rewrite.intersection.length === 0) {
      throw new AuthorizationModelError(
        `${location} cannot have an empty intersection.`,
      );
    }
    rewrite.intersection.forEach((item) =>
      validateRewrite(item, typeName, relation, relations),
    );
    return;
  }
  if (isRecord(rewrite.difference) && Object.keys(rewrite).length === 1) {
    validateRewrite(rewrite.difference.base, typeName, relation, relations);
    validateRewrite(rewrite.difference.subtract, typeName, relation, relations);
    return;
  }
  throw new AuthorizationModelError(`${location} has an invalid rewrite.`);
};

export const object = (type: string, id: string): ObjectReference => ({
  type,
  id,
});
export const subject = (
  type: string,
  id: string,
  relation?: string,
): SubjectReference => ({ type, id, relation });
export const subjectType = (
  type: string,
  relation?: string,
): SubjectTypeConstraint => ({ type, relation });
export const relation = (
  rewrite: UsersetRewrite,
  ...allowedSubjects: SubjectTypeConstraint[]
): RelationDefinition => ({ rewrite, allowedSubjects });
export const thisRelation = (): UsersetRewrite => ({ this: true });
export const computed = (relation: string): UsersetRewrite => ({
  computedUserset: relation,
});
export const from = (
  tupleset: string,
  computedUserset: string,
): UsersetRewrite => ({ tupleToUserset: { tupleset, computedUserset } });
export const union = (...rewrites: UsersetRewrite[]): UsersetRewrite => ({
  union: rewrites,
});
export const intersection = (
  ...rewrites: UsersetRewrite[]
): UsersetRewrite => ({ intersection: rewrites });
export const difference = (
  base: UsersetRewrite,
  subtract: UsersetRewrite,
): UsersetRewrite => ({ difference: { base, subtract } });
