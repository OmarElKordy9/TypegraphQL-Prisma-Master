import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Post } from "../models/Post";
import { UserKind } from "../enums/UserKind";
import { UserCount } from "../resolvers/outputs/UserCount";

@TypeGraphQL.ObjectType("User", {})
export class User {
    @TypeGraphQL.Field(_type => String, {
            nullable: false
        })
    id!: string;

    @TypeGraphQL.Field(_type => String, {
            nullable: false
        })
    email!: string;

    @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
            nullable: true
        })
    age?: number | null;

    @TypeGraphQL.Field(_type => UserKind, {
            nullable: false
        })
    kind!: "NORMAL" | "ADMIN";

    posts?: Post[];

    @TypeGraphQL.Field(_type => UserCount, {
            nullable: true
        })
    _count?: UserCount | null;
}
