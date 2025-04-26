import { Routes } from '@angular/router';
import { ListComponent } from 'app/modules/admin/files/list/list.component';
import { DetailComponent } from 'app/modules/admin/files/detail/detail.component';

export default [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
    },
    {
        path     : 'list',
        component: ListComponent,
    },
    {
        path     : 'add',
        component: DetailComponent,
    },
] as Routes;