import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserKind } from "../../enums/UserKind";

@TypeGraphQL.InputType("UserCreateManyInput", {})
export class UserCreateManyInput {
    @TypeGraphQL.Field(_type => String, {
            nullable: true
        })
    id?: string | undefined;

    @TypeGraphQL.Field(_type => String, {
            nullable: false
        })
    email!: string;

    @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
            nullable: true
        })
    age?: number | undefined;

    @TypeGraphQL.Field(_type => UserKind, {
            nullable: false
        })
    kind!: "NORMAL" | "ADMIN";
}
