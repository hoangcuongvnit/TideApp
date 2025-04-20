import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'
import Permissions from '@/constants/authority.constant'

const { UserManagementRoot } = Permissions

const administratorNavigation: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: 'Home',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'adminUserMenu',
        path: '',
        title: 'Users',
        translateKey: 'nav.userMenu.AdminUsers',
        icon: 'userMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [UserManagementRoot],
        subMenu: [
            {
                key: 'adminUserMenu.users',
                path: 'admin/users',
                title: 'List user',
                translateKey: 'nav.userMenu.listUsers',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [UserManagementRoot],
                subMenu: [],
            },
            {
                key: 'adminUserMenu.createUser',
                path: 'admin/user/create',
                title: 'Create user',
                translateKey: 'nav.userMenu.createUser',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [UserManagementRoot],
                subMenu: [],
            },
        ],
    },
]

export default administratorNavigation
