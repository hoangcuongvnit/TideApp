import { Injectable } from '@angular/core';
import { fa, faker } from '@faker-js/faker';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { roles as rolesData } from 'app/mock-api/common/roles/data';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class RolesMockApi {
    private _roles: any = rolesData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Roles - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/roles')
            .reply(() => {
                const roles = cloneDeep(this._roles);
                const total = roles.length;

                return [200, { roles, total }];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Role - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/role/:uuid')
            .reply(({ request }) => {
                let role = cloneDeep(this._roles).find((item) => item.id === request.params.get('uuid'));
                if (!role) {
                    role = {
                        id: request.params.get('uuid'),
                        name: faker.name.fullName(),
                        description: faker.lorem.sentence(),
                        permissions: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.lorem.words(2)),
                        createdAt: faker.date.past().toISOString(),
                        updatedAt: faker.date.recent().toISOString(),
                    };
                }
                return [200, role];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Roles - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/verify-role-name/:name')
            .reply(({ request }) => {
                let role = cloneDeep(this._roles).find((item) => item.name === request.params.get('name'));

                return [200, role ? true : false];
            });
    }
}
