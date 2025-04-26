/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'application',
        title: 'Application',
        type: 'group',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboards',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/dashboard'
            },
        ]
    },
    {
        id: 'blog',
        title: 'Blog',
        subtitle: 'Manage your blog',
        type: 'group',
        icon: 'heroicons_outline:clipboard-document-list',
        children: [
            {
                id: 'posts',
                title: 'Posts',
                type: 'collapsable',
                icon: 'heroicons_outline:clipboard-document-list',
                children: [
                    {
                        id: 'posts.list',
                        title: 'Posts',
                        type: 'basic',
                        icon: 'heroicons_outline:document-duplicate',
                        link: '/blog/posts/list',
                    },
                    {
                        id: 'posts.create',
                        title: 'Create Posts',
                        type: 'basic',
                        icon: 'heroicons_outline:document-plus',
                        link: '/blog/posts/create',
                    },
                ],
            },
            {
                id: 'category',
                title: 'Categories',
                type: 'collapsable',
                icon: 'heroicons_outline:presentation-chart-bar',
                children: [
                    {
                        id: 'category.list',
                        title: 'Category',
                        type: 'basic',
                        icon: 'heroicons_outline:document-chart-bar',
                        link: '/blog/categories/list',
                    },
                    {
                        id: 'category.create',
                        title: 'Create Category',
                        type: 'basic',
                        icon: 'heroicons_outline:rectangle-stack',
                        link: '/blog/categories/create',
                    },
                ],
            },
            {
                id: 'tag',
                title: 'Tags',
                type: 'collapsable',
                icon: 'heroicons_outline:tag',
                children: [
                    {
                        id: 'tag.list',
                        title: 'Tag',
                        type: 'basic',
                        icon: 'heroicons_outline:rectangle-group',
                        link: '/blog/tags/list',
                    },
                    {
                        id: 'tag.create',
                        title: 'Create Tag',
                        type: 'basic',
                        icon: 'heroicons_outline:rectangle-stack',
                        link: '/blog/tags/create',
                    },
                ],
            },
            {
                id: 'page',
                title: 'Pages',
                type: 'collapsable',
                icon: 'heroicons_outline:document-chart-bar',
                children: [
                    {
                        id: 'page.list',
                        title: 'Page',
                        type: 'basic',
                        icon: 'heroicons_outline:document-text',
                        link: '/blog/pages/list',
                    },
                    {
                        id: 'page.create',
                        title: 'Create Page',
                        type: 'basic',
                        icon: 'heroicons_outline:document-plus',
                        link: '/blog/pages/create',
                    },
                ],
            },
        ],
    },
    {
        id: 'common',
        title: 'Common',
        type: 'group',
        children: [
            {
                id: 'files',
                title: 'Files',
                type: 'basic',
                icon: 'heroicons_outline:folder-minus',
                link: '/files/list'
            },
        ]
    },
    {
        id: 'system',
        title: 'System',
        subtitle: 'Manage your system',
        type: 'group',
        children: [
            {
                id: 'users',
                title: 'Users',
                type: 'collapsable',
                icon: 'heroicons_outline:user-group',
                children: [
                    {
                        id: 'users.user',
                        title: 'Users',
                        type: 'basic',
                        icon: 'heroicons_outline:users',
                        link: '/users/list',
                    },
                    {
                        id: 'users.create',
                        title: 'Create User',
                        type: 'basic',
                        icon: 'heroicons_outline:user-plus',
                        link: '/users/create',
                    },
                ],
            },
            {
                id: 'roles',
                title: 'Roles',
                type: 'collapsable',
                icon: 'heroicons_outline:adjustments-horizontal',
                children: [
                    {
                        id: 'roles.role',
                        title: 'Roles',
                        type: 'basic',
                        icon: 'heroicons_outline:user',
                        link: '/roles/list',
                    },
                    {
                        id: 'roles.create',
                        title: 'Create Role',
                        type: 'basic',
                        icon: 'heroicons_outline:plus',
                        link: '/roles/create',
                    },
                    {
                        id: 'roles.permission',
                        title: 'Permissions',
                        type: 'basic',
                        icon: 'heroicons_outline:cpu-chip',
                        link: '/roles/permissions',
                    },
                ],
            },
            {
                id: 'setting',
                title: 'Settings',
                type: 'basic',
                icon: 'heroicons_outline:cog',
                link: '/settings',
            },
        ],
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboards',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard'
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
        id: 'dashboard',
        title: 'Dashboards',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard'
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
        id: 'dashboard',
        title: 'Dashboards',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard'
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
