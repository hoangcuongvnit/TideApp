import { Roles } from '@/constants/authority.constant'
import administratorNavigation from './administratorNavigation'
import webapplicationNavigation from './webapplicationNavigation'

function navigationConfig(role: string | null | undefined) {
    return !!role && role === Roles.Administrator ? administratorNavigation : webapplicationNavigation
}

export default navigationConfig