import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'
import Permissions from '@/constants/authority.constant'
export const publicRoutes: Routes = [...authRoute]

const { UserManagementRoot, UserManagementCreate, UserManagementView } = Permissions

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    {
        key: 'account',
        path: `/account/:tab`,
        component: lazy(() => import('@/views/account')),
        authority: [],
        meta: {
            header: 'Account',
            headerContainer: true
        }
    },
    {
        key: 'adminUsers',
        path: `admin/users/`,
        component: lazy(() => import('@/views/administrator/Users')),
        authority: [UserManagementRoot],
        meta: {
            headerContainer: true
        }
    },
    {
        key: 'viewAdminUser',
        path: `admin/user/:id`,
        component: lazy(() => import('@/views/administrator/ViewUser')),
        authority: [UserManagementRoot],
        meta: {
            header: 'User details',
            headerContainer: true
        }
    },
    {
        key: 'createAdminUser',
        path: `admin/user/create`,
        component: lazy(() => import('@/views/administrator/CreateUser')),
        authority: [UserManagementRoot]
    },
    {
        key: 'accessDenied',
        path: `/access-denied`,
        component: lazy(() => import('@/views/pages/AccessDenied')),
        authority: [],
        meta: {
            header: 'Access Denied',
            headerContainer: false
        }
    },
    {
        key: 'demoPermission',
        path: `/demo-permission`,
        component: lazy(() => import('@/views/demo/SingleMenuView')),
        authority: ['demoPermission'],
        meta: {
            header: 'Access Denied',
            headerContainer: true
        }
    },
    {
        key: 'users',
        path: `/users/`,
        component: lazy(() => import('@/views/owner/Users')),
        authority: [UserManagementView],
        meta: {
            headerContainer: true
        }
    },
    {
        key: 'viewUser',
        path: `/user/:id`,
        component: lazy(() => import('@/views/owner/ViewUser')),
        authority: [UserManagementView],
        meta: {
            header: 'User details',
            headerContainer: true
        }
    },
    {
        key: 'createUser',
        path: `/user/create`,
        component: lazy(() => import('@/views/owner/CreateUser')),
        authority: [UserManagementCreate]
    },
]