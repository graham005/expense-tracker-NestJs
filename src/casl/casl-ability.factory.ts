import { AbilityBuilder, PureAbility } from "@casl/ability";
import { Action } from "./action.enum";
import { Injectable } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { Role } from "src/users/dto/create-user.dto";

type Subject = | 'Report';

export type AppAbility = PureAbility<[Action, Subject]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User): AppAbility {
        const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

        // Admin can do anything
        if (user.role === Role.ADMIN) {
            can(Action.Manage, 'Report');
        }

        else if (user.role === Role.USER) {
            can(Action.Read, 'Report')
        }

        return build();
    }
}