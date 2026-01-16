import { AbilityBuilder, PureAbility, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { User, Permission } from '@prisma/client';

// Define subjects (add other entities as we go)
export type AppSubjects = 'User' | 'Company' | 'Branch' | 'Department' | 'Role' | 'Permission' | 'all';

export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User & { role?: { permissions: Permission[] } | null }) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

        if (user.role && user.role.permissions) {
            user.role.permissions.forEach((permission) => {
                const action = permission.action;
                const subject = permission.subject as AppSubjects;
                const conditions = permission.conditions ? (permission.conditions as PrismaQuery) : undefined;
                // Fields can be string | string[] | undefined. CASL expects undefined if all fields.
                const fields = permission.fields ? (JSON.parse(JSON.stringify(permission.fields)) as string[]) : undefined;

                if (permission.inverted) {
                    if (fields) {
                        cannot(action, subject, fields, conditions as any);
                    } else {
                        cannot(action, subject, conditions as any);
                    }
                } else {
                    if (fields) {
                        can(action, subject, fields, conditions as any);
                    } else {
                        can(action, subject, conditions as any);
                    }
                }
            });
        }

        // Default: User can read themselves (example, can be removed if fully dynamic)
        // can('read', 'User', { id: user.id });

        return build();
    }
}
