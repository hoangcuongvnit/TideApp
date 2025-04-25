import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboard'
    {path: '', pathMatch : 'full', redirectTo: 'dashboard'},

    // Redirect signed-in user to the '/dashboard'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboard'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes')},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')}
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes')},
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'dashboard', loadChildren: () => import('app/modules/admin/dashboard/dashboard.routes')},
            // Users
            {path: 'users', children: [
                {path: 'user', loadChildren: () => import('app/modules/admin/users/user/user.routes')},
                {path: 'create-user', loadChildren: () => import('app/modules/admin/users/detail/detail.routes')},
                {path: 'edit-user', loadChildren: () => import('app/modules/admin/users/detail/detail.routes')},
            ]},
            // Posts
            {path: 'posts', children: [
                {path: 'list', loadChildren: () => import('app/modules/admin/blog/posts/posts/posts.routes')},
                {path: 'create-posts', loadChildren: () => import('app/modules/admin/blog/posts/detail/detail.routes')},
                {path: 'edit-posts', loadChildren: () => import('app/modules/admin/blog/posts/detail/detail.routes')},
            ]},
            // Category
            {path: 'category', children: [
                {path: 'list', loadChildren: () => import('app/modules/admin/blog/category/category/category.routes')},
                {path: 'create-category', loadChildren: () => import('app/modules/admin/blog/category/detail/detail.routes')},
                {path: 'edit-category', loadChildren: () => import('app/modules/admin/blog/category/detail/detail.routes')},
            ]},
            // Tag
            {path: 'tags', children: [
                {path: 'list', loadChildren: () => import('app/modules/admin/blog/tag/tag/tag.routes')},
                {path: 'create-tag', loadChildren: () => import('app/modules/admin/blog/tag/detail/detail.routes')},
                {path: 'edit-tag', loadChildren: () => import('app/modules/admin/blog/tag/detail/detail.routes')},
            ]},
            // Pages
            {path: 'pages', children: [
                {path: 'list', loadChildren: () => import('app/modules/admin/blog/page/page/page.routes')},
                {path: 'create-page', loadChildren: () => import('app/modules/admin/blog/page/detail/detail.routes')},
                {path: 'edit-page', loadChildren: () => import('app/modules/admin/blog/page/detail/detail.routes')},
            ]},
            // Media
            {path: 'media', children: [
                {path: 'list', loadChildren: () => import('app/modules/admin/media/media/media.routes')},
                {path: 'add', loadChildren: () => import('app/modules/admin/media/detail/detail.routes')},
            ]},
            // Roles
            {path: 'roles', children: [
                {path: 'role', loadChildren: () => import('app/modules/admin/roles/role/role.routes')},
                {path: 'create-role', loadChildren: () => import('app/modules/admin/roles/detail/detail.routes')},
                {path: 'edit-role', loadChildren: () => import('app/modules/admin/roles/detail/detail.routes')},
                {path: 'permissions', loadChildren: () => import('app/modules/admin/permission/permission.routes')},
            ]},
            // Settings
            {path: 'settings', loadChildren: () => import('app/modules/admin/setting/setting.routes')},
        ]
    }
];
