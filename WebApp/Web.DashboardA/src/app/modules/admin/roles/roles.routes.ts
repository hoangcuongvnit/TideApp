import { Routes } from '@angular/router';
import { ListComponent } from 'app/modules/admin/roles/list/list.component';
import { DetailComponent } from 'app/modules/admin/roles/detail/detail.component';
import { PermissionComponent } from 'app/modules/admin/roles/permission/permission.component';

export default [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
    },
    {
        path: 'list',
        component: ListComponent,
        resolve: {
        },
    },
    {
        path: 'create',
        component: DetailComponent,
        resolve: {
        },
    },
    {
        path: 'permissions',
        component: PermissionComponent,
        resolve: {
        },
    },
] as Routes;
