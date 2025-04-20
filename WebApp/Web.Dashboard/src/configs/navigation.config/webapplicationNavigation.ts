import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'
import Permissions from '@/constants/authority.constant'

const { UserManagementCreate, UserManagementView } = Permissions

const webapplicationNavigation: NavigationTree[] = [
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
        key: 'userMenu',
        path: '',
        title: 'Users',
        translateKey: 'nav.userMenu.Users',
        icon: 'userMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [UserManagementView],
        subMenu: [
            {
                key: 'userMenu.users',
                path: '/users',
                title: 'List user',
                translateKey: 'nav.userMenu.listUsers',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [UserManagementView],
                subMenu: [],
            },
            {
                key: 'userMenu.createUser',
                path: '/user/create',
                title: 'Create user',
                translateKey: 'nav.userMenu.createUser',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [UserManagementCreate],
                subMenu: [],
            },
        ],
    }
]

export default webapplicationNavigation
