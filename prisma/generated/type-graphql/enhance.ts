import { ClassType } from "type-graphql";
import * as tslib from "tslib";
import * as crudResolvers from "./resolvers/crud/resolvers-crud.index";
import * as argsTypes from "./resolvers/crud/args.index";
import * as actionResolvers from "./resolvers/crud/resolvers-actions.index";
import * as relationResolvers from "./resolvers/relations/resolvers.index";
import * as models from "./models";
import * as outputTypes from "./resolvers/outputs";
import * as inputTypes from "./resolvers/inputs";

      export type MethodDecoratorOverrideFn = (decorators: MethodDecorator[]) => MethodDecorator[];

const crudResolversMap = {
        User: crudResolvers.UserCrudResolver,
        Post: crudResolvers.PostCrudResolver
    };
const actionResolversMap = {
        User: {
            aggregateUser: actionResolvers.AggregateUserResolver,
            createManyUser: actionResolvers.CreateManyUserResolver,
            createOneUser: actionResolvers.CreateOneUserResolver,
            deleteManyUser: actionResolvers.DeleteManyUserResolver,
            deleteOneUser: actionResolvers.DeleteOneUserResolver,
            findFirstUser: actionResolvers.FindFirstUserResolver,
            findFirstUserOrThrow: actionResolvers.FindFirstUserOrThrowResolver,
            users: actionResolvers.FindManyUserResolver,
            user: actionResolvers.FindUniqueUserResolver,
            getUser: actionResolvers.FindUniqueUserOrThrowResolver,
            groupByUser: actionResolvers.GroupByUserResolver,
            updateManyUser: actionResolvers.UpdateManyUserResolver,
            updateOneUser: actionResolvers.UpdateOneUserResolver,
            upsertOneUser: actionResolvers.UpsertOneUserResolver
        },
        Post: {
            aggregatePost: actionResolvers.AggregatePostResolver,
            createManyPost: actionResolvers.CreateManyPostResolver,
            createOnePost: actionResolvers.CreateOnePostResolver,
            deleteManyPost: actionResolvers.DeleteManyPostResolver,
            deleteOnePost: actionResolvers.DeleteOnePostResolver,
            findFirstPost: actionResolvers.FindFirstPostResolver,
            findFirstPostOrThrow: actionResolvers.FindFirstPostOrThrowResolver,
            posts: actionResolvers.FindManyPostResolver,
            post: actionResolvers.FindUniquePostResolver,
            getPost: actionResolvers.FindUniquePostOrThrowResolver,
            groupByPost: actionResolvers.GroupByPostResolver,
            updateManyPost: actionResolvers.UpdateManyPostResolver,
            updateOnePost: actionResolvers.UpdateOnePostResolver,
            upsertOnePost: actionResolvers.UpsertOnePostResolver
        }
    };
const crudResolversInfo = {
        User: ["aggregateUser", "createManyUser", "createOneUser", "deleteManyUser", "deleteOneUser", "findFirstUser", "findFirstUserOrThrow", "users", "user", "getUser", "groupByUser", "updateManyUser", "updateOneUser", "upsertOneUser"],
        Post: ["aggregatePost", "createManyPost", "createOnePost", "deleteManyPost", "deleteOnePost", "findFirstPost", "findFirstPostOrThrow", "posts", "post", "getPost", "groupByPost", "updateManyPost", "updateOnePost", "upsertOnePost"]
    };
const argsInfo = {
        AggregateUserArgs: ["where", "orderBy", "cursor", "take", "skip"],
        CreateManyUserArgs: ["data", "skipDuplicates"],
        CreateOneUserArgs: ["data"],
        DeleteManyUserArgs: ["where"],
        DeleteOneUserArgs: ["where"],
        FindFirstUserArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
        FindFirstUserOrThrowArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
        FindManyUserArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
        FindUniqueUserArgs: ["where"],
        FindUniqueUserOrThrowArgs: ["where"],
        GroupByUserArgs: ["where", "orderBy", "by", "having", "take", "skip"],
        UpdateManyUserArgs: ["data", "where"],
        UpdateOneUserArgs: ["data", "where"],
        UpsertOneUserArgs: ["where", "create", "update"],
        AggregatePostArgs: ["where", "orderBy", "cursor", "take", "skip"],
        CreateManyPostArgs: ["data", "skipDuplicates"],
        CreateOnePostArgs: ["data"],
        DeleteManyPostArgs: ["where"],
        DeleteOnePostArgs: ["where"],
        FindFirstPostArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
        FindFirstPostOrThrowArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
        FindManyPostArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
        FindUniquePostArgs: ["where"],
        FindUniquePostOrThrowArgs: ["where"],
        GroupByPostArgs: ["where", "orderBy", "by", "having", "take", "skip"],
        UpdateManyPostArgs: ["data", "where"],
        UpdateOnePostArgs: ["data", "where"],
        UpsertOnePostArgs: ["where", "create", "update"]
    };

      type ResolverModelNames = keyof typeof crudResolversMap;

      type ModelResolverActionNames<
        TModel extends ResolverModelNames
        > = keyof typeof crudResolversMap[TModel]["prototype"];

      export type ResolverActionsConfig<
        TModel extends ResolverModelNames
      > = Partial<Record<ModelResolverActionNames<TModel>, MethodDecorator[] | MethodDecoratorOverrideFn>>
        & {
          _all?: MethodDecorator[];
          _query?: MethodDecorator[];
          _mutation?: MethodDecorator[];
        };

      export type ResolversEnhanceMap = {
        [TModel in ResolverModelNames]?: ResolverActionsConfig<TModel>;
      };

      export function applyResolversEnhanceMap(
        resolversEnhanceMap: ResolversEnhanceMap,
      ) {
        const mutationOperationPrefixes = [
          "createOne", "createMany", "deleteOne", "updateOne", "deleteMany", "updateMany", "upsertOne"
        ];
        for (const resolversEnhanceMapKey of Object.keys(resolversEnhanceMap)) {
          const modelName = resolversEnhanceMapKey as keyof typeof resolversEnhanceMap;
          const crudTarget = crudResolversMap[modelName].prototype;
          const resolverActionsConfig = resolversEnhanceMap[modelName]!;
          const actionResolversConfig = actionResolversMap[modelName];
          const allActionsDecorators = resolverActionsConfig._all;
          const resolverActionNames = crudResolversInfo[modelName as keyof typeof crudResolversInfo];
          for (const resolverActionName of resolverActionNames) {
            const maybeDecoratorsOrFn = resolverActionsConfig[
              resolverActionName as keyof typeof resolverActionsConfig
            ] as MethodDecorator[] | MethodDecoratorOverrideFn | undefined;
            const isWriteOperation = mutationOperationPrefixes.some(prefix => resolverActionName.startsWith(prefix));
            const operationKindDecorators = isWriteOperation ? resolverActionsConfig._mutation : resolverActionsConfig._query;
            const mainDecorators = [
              ...allActionsDecorators ?? [],
              ...operationKindDecorators ?? [],
            ]
            let decorators: MethodDecorator[];
            if (typeof maybeDecoratorsOrFn === "function") {
              decorators = maybeDecoratorsOrFn(mainDecorators);
            } else {
              decorators = [...mainDecorators, ...maybeDecoratorsOrFn ?? []];
            }
            const actionTarget = (actionResolversConfig[
              resolverActionName as keyof typeof actionResolversConfig
            ] as Function).prototype;
            tslib.__decorate(decorators, crudTarget, resolverActionName, null);
            tslib.__decorate(decorators, actionTarget, resolverActionName, null);
          }
        }
      }

      type ArgsTypesNames = keyof typeof argsTypes;

      type ArgFieldNames<TArgsType extends ArgsTypesNames> = Exclude<
        keyof typeof argsTypes[TArgsType]["prototype"],
        number | symbol
      >;

      type ArgFieldsConfig<
        TArgsType extends ArgsTypesNames
      > = FieldsConfig<ArgFieldNames<TArgsType>>;

      export type ArgConfig<TArgsType extends ArgsTypesNames> = {
        class?: ClassDecorator[];
        fields?: ArgFieldsConfig<TArgsType>;
      };

      export type ArgsTypesEnhanceMap = {
        [TArgsType in ArgsTypesNames]?: ArgConfig<TArgsType>;
      };

      export function applyArgsTypesEnhanceMap(
        argsTypesEnhanceMap: ArgsTypesEnhanceMap,
      ) {
        for (const argsTypesEnhanceMapKey of Object.keys(argsTypesEnhanceMap)) {
          const argsTypeName = argsTypesEnhanceMapKey as keyof typeof argsTypesEnhanceMap;
          const typeConfig = argsTypesEnhanceMap[argsTypeName]!;
          const typeClass = argsTypes[argsTypeName];
          const typeTarget = typeClass.prototype;
          applyTypeClassEnhanceConfig(
            typeConfig,
            typeClass,
            typeTarget,
            argsInfo[argsTypeName as keyof typeof argsInfo],
          );
        }
      }

const relationResolversMap = {
        User: relationResolvers.UserRelationsResolver,
        Post: relationResolvers.PostRelationsResolver
    };
const relationResolversInfo = {
        User: ["posts"],
        Post: ["author"]
    };

      type RelationResolverModelNames = keyof typeof relationResolversMap;

      type RelationResolverActionNames<
        TModel extends RelationResolverModelNames
        > = keyof typeof relationResolversMap[TModel]["prototype"];

      export type RelationResolverActionsConfig<TModel extends RelationResolverModelNames>
        = Partial<Record<RelationResolverActionNames<TModel>, MethodDecorator[] | MethodDecoratorOverrideFn>>
        & { _all?: MethodDecorator[] };

      export type RelationResolversEnhanceMap = {
        [TModel in RelationResolverModelNames]?: RelationResolverActionsConfig<TModel>;
      };

      export function applyRelationResolversEnhanceMap(
        relationResolversEnhanceMap: RelationResolversEnhanceMap,
      ) {
        for (const relationResolversEnhanceMapKey of Object.keys(relationResolversEnhanceMap)) {
          const modelName = relationResolversEnhanceMapKey as keyof typeof relationResolversEnhanceMap;
          const relationResolverTarget = relationResolversMap[modelName].prototype;
          const relationResolverActionsConfig = relationResolversEnhanceMap[modelName]!;
          const allActionsDecorators = relationResolverActionsConfig._all ?? [];
          const relationResolverActionNames = relationResolversInfo[modelName as keyof typeof relationResolversInfo];
          for (const relationResolverActionName of relationResolverActionNames) {
            const maybeDecoratorsOrFn = relationResolverActionsConfig[
              relationResolverActionName as keyof typeof relationResolverActionsConfig
            ] as MethodDecorator[] | MethodDecoratorOverrideFn | undefined;
            let decorators: MethodDecorator[];
            if (typeof maybeDecoratorsOrFn === "function") {
              decorators = maybeDecoratorsOrFn(allActionsDecorators);
            } else {
              decorators = [...allActionsDecorators, ...maybeDecoratorsOrFn ?? []];
            }
            tslib.__decorate(decorators, relationResolverTarget, relationResolverActionName, null);
          }
        }
      }

      type TypeConfig = {
        class?: ClassDecorator[];
        fields?: FieldsConfig;
      };

      export type PropertyDecoratorOverrideFn = (decorators: PropertyDecorator[]) => PropertyDecorator[];

      type FieldsConfig<TTypeKeys extends string = string> = Partial<
        Record<TTypeKeys, PropertyDecorator[] | PropertyDecoratorOverrideFn>
      > & { _all?: PropertyDecorator[] };

      function applyTypeClassEnhanceConfig<
        TEnhanceConfig extends TypeConfig,
        TType extends object
      >(
        enhanceConfig: TEnhanceConfig,
        typeClass: ClassType<TType>,
        typePrototype: TType,
        typeFieldNames: string[]
      ) {
        if (enhanceConfig.class) {
          tslib.__decorate(enhanceConfig.class, typeClass);
        }
        if (enhanceConfig.fields) {
          const allFieldsDecorators = enhanceConfig.fields._all ?? [];
          for (const typeFieldName of typeFieldNames) {
            const maybeDecoratorsOrFn = enhanceConfig.fields[
              typeFieldName
            ] as PropertyDecorator[] | PropertyDecoratorOverrideFn | undefined;
            let decorators: PropertyDecorator[];
            if (typeof maybeDecoratorsOrFn === "function") {
              decorators = maybeDecoratorsOrFn(allFieldsDecorators);
            } else {
              decorators = [...allFieldsDecorators, ...maybeDecoratorsOrFn ?? []];
            }
            tslib.__decorate(decorators, typePrototype, typeFieldName, void 0);
          }
        }
      }

const modelsInfo = {
        User: ["id", "email", "age", "kind"],
        Post: ["id", "createdAt", "updatedAt", "published", "title", "content", "authorId"]
    };

      type ModelNames = keyof typeof models;

      type ModelFieldNames<TModel extends ModelNames> = Exclude<
        keyof typeof models[TModel]["prototype"],
        number | symbol
      >;

      type ModelFieldsConfig<TModel extends ModelNames> = FieldsConfig<
        ModelFieldNames<TModel>
      >;

      export type ModelConfig<TModel extends ModelNames> = {
        class?: ClassDecorator[];
        fields?: ModelFieldsConfig<TModel>;
      };

      export type ModelsEnhanceMap = {
        [TModel in ModelNames]?: ModelConfig<TModel>;
      };

      export function applyModelsEnhanceMap(modelsEnhanceMap: ModelsEnhanceMap) {
        for (const modelsEnhanceMapKey of Object.keys(modelsEnhanceMap)) {
          const modelName = modelsEnhanceMapKey as keyof typeof modelsEnhanceMap;
          const modelConfig = modelsEnhanceMap[modelName]!;
          const modelClass = models[modelName];
          const modelTarget = modelClass.prototype;
          applyTypeClassEnhanceConfig(
            modelConfig,
            modelClass,
            modelTarget,
            modelsInfo[modelName as keyof typeof modelsInfo],
          );
        }
      }

const outputsInfo = {
        AggregateUser: ["_count", "_avg", "_sum", "_min", "_max"],
        UserGroupBy: ["id", "email", "age", "kind", "_count", "_avg", "_sum", "_min", "_max"],
        AggregatePost: ["_count", "_min", "_max"],
        PostGroupBy: ["id", "createdAt", "updatedAt", "published", "title", "content", "authorId", "_count", "_min", "_max"],
        AffectedRowsOutput: ["count"],
        UserCount: ["posts"],
        UserCountAggregate: ["id", "email", "age", "kind", "_all"],
        UserAvgAggregate: ["age"],
        UserSumAggregate: ["age"],
        UserMinAggregate: ["id", "email", "age", "kind"],
        UserMaxAggregate: ["id", "email", "age", "kind"],
        PostCountAggregate: ["id", "createdAt", "updatedAt", "published", "title", "content", "authorId", "_all"],
        PostMinAggregate: ["id", "createdAt", "updatedAt", "published", "title", "content", "authorId"],
        PostMaxAggregate: ["id", "createdAt", "updatedAt", "published", "title", "content", "authorId"],
        CreateManyUserAndReturnOutputType: ["id", "email", "age", "kind"],
        CreateManyPostAndReturnOutputType: ["id", "createdAt", "updatedAt", "published", "title", "content", "authorId", "author"]
    };

      type OutputTypesNames = keyof typeof outputTypes;

      type OutputTypeFieldNames<TOutput extends OutputTypesNames> = Exclude<
        keyof typeof outputTypes[TOutput]["prototype"],
        number | symbol
      >;

      type OutputTypeFieldsConfig<
        TOutput extends OutputTypesNames
      > = FieldsConfig<OutputTypeFieldNames<TOutput>>;

      export type OutputTypeConfig<TOutput extends OutputTypesNames> = {
        class?: ClassDecorator[];
        fields?: OutputTypeFieldsConfig<TOutput>;
      };

      export type OutputTypesEnhanceMap = {
        [TOutput in OutputTypesNames]?: OutputTypeConfig<TOutput>;
      };

      export function applyOutputTypesEnhanceMap(
        outputTypesEnhanceMap: OutputTypesEnhanceMap,
      ) {
        for (const outputTypeEnhanceMapKey of Object.keys(outputTypesEnhanceMap)) {
          const outputTypeName = outputTypeEnhanceMapKey as keyof typeof outputTypesEnhanceMap;
          const typeConfig = outputTypesEnhanceMap[outputTypeName]!;
          const typeClass = outputTypes[outputTypeName];
          const typeTarget = typeClass.prototype;
          applyTypeClassEnhanceConfig(
            typeConfig,
            typeClass,
            typeTarget,
            outputsInfo[outputTypeName as keyof typeof outputsInfo],
          );
        }
      }

const inputsInfo = {
        UserWhereInput: ["AND", "OR", "NOT", "id", "email", "age", "kind", "posts"],
        UserOrderByWithRelationInput: ["id", "email", "age", "kind", "posts"],
        UserWhereUniqueInput: ["id", "email", "AND", "OR", "NOT", "age", "kind", "posts"],
        UserOrderByWithAggregationInput: ["id", "email", "age", "kind", "_count", "_avg", "_max", "_min", "_sum"],
        UserScalarWhereWithAggregatesInput: ["AND", "OR", "NOT", "id", "email", "age", "kind"],
        PostWhereInput: ["AND", "OR", "NOT", "id", "createdAt", "updatedAt", "published", "title", "content", "authorId", "author"],
        PostOrderByWithRelationInput: ["id", "createdAt", "updatedAt", "published", "title", "content", "authorId", "author"],
        PostWhereUniqueInput: ["id", "AND", "OR", "NOT", "createdAt", "updatedAt", "published", "title", "content", "authorId", "author"],
        PostOrderByWithAggregationInput: ["id", "createdAt", "updatedAt", "published", "title", "content", "authorId", "_count", "_max", "_min"],
        PostScalarWhereWithAggregatesInput: ["AND", "OR", "NOT", "id", "createdAt", "updatedAt", "published", "title", "content", "authorId"],
        UserCreateInput: ["id", "email", "age", "kind", "posts"],
        UserUpdateInput: ["id", "email", "age", "kind", "posts"],
        UserCreateManyInput: ["id", "email", "age", "kind"],
        UserUpdateManyMutationInput: ["id", "email", "age", "kind"],
        PostCreateInput: ["id", "createdAt", "updatedAt", "published", "title", "content", "author"],
        PostUpdateInput: ["id", "createdAt", "updatedAt", "published", "title", "content", "author"],
        PostCreateManyInput: ["id", "createdAt", "updatedAt", "published", "title", "content", "authorId"],
        PostUpdateManyMutationInput: ["id", "createdAt", "updatedAt", "published", "title", "content"],
        StringFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "mode", "not"],
        IntNullableFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
        EnumUserKindFilter: ["equals", "in", "notIn", "not"],
        PostListRelationFilter: ["every", "some", "none"],
        SortOrderInput: ["sort", "nulls"],
        PostOrderByRelationAggregateInput: ["_count"],
        UserCountOrderByAggregateInput: ["id", "email", "age", "kind"],
        UserAvgOrderByAggregateInput: ["age"],
        UserMaxOrderByAggregateInput: ["id", "email", "age", "kind"],
        UserMinOrderByAggregateInput: ["id", "email", "age", "kind"],
        UserSumOrderByAggregateInput: ["age"],
        StringWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "mode", "not", "_count", "_min", "_max"],
        IntNullableWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "_count", "_avg", "_sum", "_min", "_max"],
        EnumUserKindWithAggregatesFilter: ["equals", "in", "notIn", "not", "_count", "_min", "_max"],
        DateTimeFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
        BoolFilter: ["equals", "not"],
        StringNullableFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "mode", "not"],
        UserNullableRelationFilter: ["is", "isNot"],
        PostCountOrderByAggregateInput: ["id", "createdAt", "updatedAt", "published", "title", "content", "authorId"],
        PostMaxOrderByAggregateInput: ["id", "createdAt", "updatedAt", "published", "title", "content", "authorId"],
        PostMinOrderByAggregateInput: ["id", "createdAt", "updatedAt", "published", "title", "content", "authorId"],
        DateTimeWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "_count", "_min", "_max"],
        BoolWithAggregatesFilter: ["equals", "not", "_count", "_min", "_max"],
        StringNullableWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "mode", "not", "_count", "_min", "_max"],
        PostCreateNestedManyWithoutAuthorInput: ["create", "connectOrCreate", "createMany", "connect"],
        StringFieldUpdateOperationsInput: ["set"],
        NullableIntFieldUpdateOperationsInput: ["set", "increment", "decrement", "multiply", "divide"],
        EnumUserKindFieldUpdateOperationsInput: ["set"],
        PostUpdateManyWithoutAuthorNestedInput: ["create", "connectOrCreate", "upsert", "createMany", "set", "disconnect", "delete", "connect", "update", "updateMany", "deleteMany"],
        UserCreateNestedOneWithoutPostsInput: ["create", "connectOrCreate", "connect"],
        DateTimeFieldUpdateOperationsInput: ["set"],
        BoolFieldUpdateOperationsInput: ["set"],
        NullableStringFieldUpdateOperationsInput: ["set"],
        UserUpdateOneWithoutPostsNestedInput: ["create", "connectOrCreate", "upsert", "disconnect", "delete", "connect", "update"],
        NestedStringFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "not"],
        NestedIntNullableFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
        NestedEnumUserKindFilter: ["equals", "in", "notIn", "not"],
        NestedStringWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "not", "_count", "_min", "_max"],
        NestedIntFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
        NestedIntNullableWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "_count", "_avg", "_sum", "_min", "_max"],
        NestedFloatNullableFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
        NestedEnumUserKindWithAggregatesFilter: ["equals", "in", "notIn", "not", "_count", "_min", "_max"],
        NestedDateTimeFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
        NestedBoolFilter: ["equals", "not"],
        NestedStringNullableFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "not"],
        NestedDateTimeWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "_count", "_min", "_max"],
        NestedBoolWithAggregatesFilter: ["equals", "not", "_count", "_min", "_max"],
        NestedStringNullableWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "not", "_count", "_min", "_max"],
        PostCreateWithoutAuthorInput: ["id", "createdAt", "updatedAt", "published", "title", "content"],
        PostCreateOrConnectWithoutAuthorInput: ["where", "create"],
        PostCreateManyAuthorInputEnvelope: ["data", "skipDuplicates"],
        PostUpsertWithWhereUniqueWithoutAuthorInput: ["where", "update", "create"],
        PostUpdateWithWhereUniqueWithoutAuthorInput: ["where", "data"],
        PostUpdateManyWithWhereWithoutAuthorInput: ["where", "data"],
        PostScalarWhereInput: ["AND", "OR", "NOT", "id", "createdAt", "updatedAt", "published", "title", "content", "authorId"],
        UserCreateWithoutPostsInput: ["id", "email", "age", "kind"],
        UserCreateOrConnectWithoutPostsInput: ["where", "create"],
        UserUpsertWithoutPostsInput: ["update", "create", "where"],
        UserUpdateToOneWithWhereWithoutPostsInput: ["where", "data"],
        UserUpdateWithoutPostsInput: ["id", "email", "age", "kind"],
        PostCreateManyAuthorInput: ["id", "createdAt", "updatedAt", "published", "title", "content"],
        PostUpdateWithoutAuthorInput: ["id", "createdAt", "updatedAt", "published", "title", "content"]
    };

      type InputTypesNames = keyof typeof inputTypes;

      type InputTypeFieldNames<TInput extends InputTypesNames> = Exclude<
        keyof typeof inputTypes[TInput]["prototype"],
        number | symbol
      >;

      type InputTypeFieldsConfig<
        TInput extends InputTypesNames
      > = FieldsConfig<InputTypeFieldNames<TInput>>;

      export type InputTypeConfig<TInput extends InputTypesNames> = {
        class?: ClassDecorator[];
        fields?: InputTypeFieldsConfig<TInput>;
      };

      export type InputTypesEnhanceMap = {
        [TInput in InputTypesNames]?: InputTypeConfig<TInput>;
      };

      export function applyInputTypesEnhanceMap(
        inputTypesEnhanceMap: InputTypesEnhanceMap,
      ) {
        for (const inputTypeEnhanceMapKey of Object.keys(inputTypesEnhanceMap)) {
          const inputTypeName = inputTypeEnhanceMapKey as keyof typeof inputTypesEnhanceMap;
          const typeConfig = inputTypesEnhanceMap[inputTypeName]!;
          const typeClass = inputTypes[inputTypeName];
          const typeTarget = typeClass.prototype;
          applyTypeClassEnhanceConfig(
            typeConfig,
            typeClass,
            typeTarget,
            inputsInfo[inputTypeName as keyof typeof inputsInfo],
          );
        }
      }
    
