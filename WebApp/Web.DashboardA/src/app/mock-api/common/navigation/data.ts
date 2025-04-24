/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboards',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard'
    },
    {
        id: 'users',
        title: 'Users',
        subtitle: 'Manage your users',
        type: 'group',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: 'users.user',
                title: 'User',
                type: 'basic',
                icon: 'heroicons_outline:user-circle',
                link: '/users/user',
            },
            {
                id: 'users.create',
                title: 'Create User',
                type: 'basic',
                icon: 'heroicons_outline:user-plus',
                link: '/users/create-user',
            },
        ],
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboards',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard'
    },
    {
        id: 'users',
        title: 'Users',
        subtitle: 'Manage your users',
        type: 'group',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: 'users.user',
                title: 'User',
                type: 'basic',
                icon: 'heroicons_outline:user-circle',
                link: '/users/user',
            },
        ],
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboards',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard'
    },
    {
        id: 'users',
        title: 'Users',
        subtitle: 'Manage your users',
        type: 'group',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: 'users.user',
                title: 'User',
                type: 'basic',
                icon: 'heroicons_outline:user-circle',
                link: '/users/user',
            },
        ],
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboards',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard'
    },
    {
        id: 'users',
        title: 'Users',
        subtitle: 'Manage your users',
        type: 'group',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: 'users.user',
                title: 'User',
                type: 'basic',
                icon: 'heroicons_outline:user-circle',
                link: '/users/user',
            },
        ],
    }
];
