import { useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'

function useAuthority(
    userAuthority: string[] = [],
    authority: string[] = [],
    emptyUserAuthorityCheck = false
) {
    const roleMatched = useMemo(() => {
        return authority.some((role) => userAuthority.includes(role))
    }, [authority, userAuthority])

    if (
        !authority ||
        isEmpty(authority) ||
        typeof authority === 'undefined'
    ) {
        return true
    }

    if (
        !userAuthority ||
        isEmpty(userAuthority) ||
        typeof userAuthority === 'undefined'
    ) {
        return !emptyUserAuthorityCheck
    }

    return roleMatched
}

export default useAuthority
