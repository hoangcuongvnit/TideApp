import { Injectable } from '@angular/core';
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
    }
}
