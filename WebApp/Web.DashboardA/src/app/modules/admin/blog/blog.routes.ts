import { Routes } from '@angular/router';

export default [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'posts',
    },
    {
        path: 'posts',
        loadChildren: () => import('./posts/posts.routes').then(m => m.default),
    },
    {
        path: 'pages',
        loadChildren: () => import('./pages/pages.routes'),
    },
    {
        path: 'categories',
        loadChildren: () => import('./categories/categories.routes'),
    },
    {
        path: 'tags',
        loadChildren: () => import('./tags/tags.routes'),
    },
] as Routes;
