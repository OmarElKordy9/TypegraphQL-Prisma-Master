import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { UserWhereInput } from "../../inputs/UserWhereInput";

@TypeGraphQL.ArgsType()
export class CreateManyPostAndReturnOutputTypeAuthorArgs {
    @TypeGraphQL.Field(_type => UserWhereInput, {
            nullable: true
        })
    where?: UserWhereInput | undefined;
}
