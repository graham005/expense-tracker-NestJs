import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { CHECK_POLICIES_KEY } from "../decorators/check-policies.decorator";
import { PolicyHandler } from "../interfaces/policy-handler.interface";
import { CaslAbilityFactory } from "../casl-ability.factory";

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const PolicyHandler =
            this.reflector.get<PolicyHandler[]>(
                CHECK_POLICIES_KEY,
                context.getHandler(),
            ) || [];
        
        if (PolicyHandler.length === 0) {
            return true; // No policies defined means no restrictions
        }

        const { user } = context.switchToHttp().getRequest();
        if(!user) {
            return false; // No user means no permissions
        }

        const ability = this.caslAbilityFactory.createForUser(user);

        return PolicyHandler.every((handler) => 
            this.execPolicyHandler(handler, ability)
        )
    }

    private execPolicyHandler(handler: PolicyHandler, ability: any) {
        if( typeof handler === 'function') {
            return handler(ability);
        }
        return handler.handle(ability)
    }
}