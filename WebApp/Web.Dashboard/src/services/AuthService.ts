import ApiService from './ApiService'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    VerifyEmail,
    SignInResponse,
    SignUpResponse,
    VerifyResponse,
} from '@/@types/auth'

export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchData<SignInResponse>({
        url: '/auth/login',
        method: 'post',
        data,
    })
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchData<SignUpResponse>({
        url: '/auth/register',
        method: 'post',
        data,
    })
}

export async function apiSignOut() {
    return ApiService.fetchData({
        url: '/auth/logout',
        method: 'post',
        data: {},
    })
}

export async function apiForgotPassword(data: ForgotPassword) {
    return ApiService.fetchData({
        url: '/auth/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiResetPassword(id: string, data: ResetPassword) {

    return ApiService.fetchData({
        url: `/auth/reset-password/${id}`,
        method: 'post',
        data,
    })
}

export async function apiVerifyEmail(datas: VerifyEmail) {
    const { id, token } = datas
    return ApiService.fetchData<VerifyResponse>({
        url: `/auth/confirm-email/${id}?code=${token}`,
        method: 'get',
    })
}
