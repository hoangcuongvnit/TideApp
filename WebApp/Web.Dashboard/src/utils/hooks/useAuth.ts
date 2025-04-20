import { apiSignIn, apiSignUp } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import appConfig, { ApiResponses, ApiStatus } from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import { jwtDecode } from 'jwt-decode'
import type { SignInCredential, SignUpCredential, TokenData } from '@/@types/auth'
import Permissions from '@/constants/authority.constant'
import { isEmpty, split } from 'lodash'

function useAuth() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const query = useQuery()
    const { token, signedIn, roles } = useAppSelector((state) => state.auth.session)
    const { DefaultManageSystem } = Permissions

    const signIn = async (
        values: SignInCredential
    ): Promise<
        | ApiResponses
        | undefined
    > => {
        try {
            const resp = await apiSignIn(values)
            if (resp.data && resp.data.results) {
                const separator = ';'
                const { token, avatar } = resp.data.results
                // Decode the JWT token
                const decodedToken = jwtDecode<TokenData>(token)
                const roles = split(decodedToken.roles, separator)
                dispatch(signInSuccess({ token, roles, expires: decodedToken.exp }))

                const authority = !isEmpty(decodedToken.authority) ? split(decodedToken.authority, separator) : [DefaultManageSystem]
                const { userId, email, displayName } = decodedToken
                const userData = { id: userId, email, avatar, displayName, authority, role: roles[0] ?? '' }
                dispatch(
                    setUser(
                        userData || {
                            id: '',
                            email: ''
                        }
                    )
                )

                const redirectUrl = query.get(REDIRECT_URL_KEY)
                let pathDefault = appConfig.authenticatedEntryPath
                navigate(
                    redirectUrl ? redirectUrl : pathDefault
                )
                return {
                    status: ApiStatus.success,
                    results: resp.data.results
                }
            }
        } catch (errors: any) {
            return {
                status: ApiStatus.failed,
                errors
            }
        }
    }

    const signUp = async (values: SignUpCredential): Promise<
        | ApiResponses
        | undefined
    > => {
        try {
            const resp = await apiSignUp(values)
            if (resp.data) {
                const { results } = resp.data
                navigate(appConfig.verifyEmailPath)
                return {
                    status: ApiStatus.success,
                    results
                }
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: ApiStatus.failed,
                errors
            }
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(
            setUser({
                email: '',
                id: ''
            })
        )
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        roles,
        signIn,
        signUp,
        signOut,
    }
}

export default useAuth
