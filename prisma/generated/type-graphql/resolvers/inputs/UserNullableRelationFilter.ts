import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserWhereInput } from "../inputs/UserWhereInput";

@TypeGraphQL.InputType("UserNullableRelationFilter", {})
export class UserNullableRelationFilter {
    @TypeGraphQL.Field(_type => UserWhereInput, {
            nullable: true
        })
    is?: UserWhereInput | undefined;

    @TypeGraphQL.Field(_type => UserWhereInput, {
            nullable: true
        })
    isNot?: UserWhereInput | undefined;
}
