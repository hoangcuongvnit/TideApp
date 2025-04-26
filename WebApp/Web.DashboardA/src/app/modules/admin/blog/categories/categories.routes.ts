import { Routes } from '@angular/router';
import { ListComponent } from 'app/modules/admin/blog/categories/list/list.component';
import { DetailComponent } from 'app/modules/admin/blog/categories/detail/detail.component';

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
        path     : 'create',
        component: DetailComponent,
    },
] as Routes;
