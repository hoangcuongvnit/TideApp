import { BooleanResponses } from '@/@types/apiResponses'
import ApiService from './ApiService'
import type {
    ProfileUpdateModel,
    PasswordUpdateModel
} from '@/@types/account'

export async function apiGetProfile<Data>() {
    return ApiService.fetchData<Data>({
        url: '/profile',
        method: 'get',
    })
}

export async function apiPutAccountProfile(data: ProfileUpdateModel) {
    return ApiService.fetchData<BooleanResponses>({
        url: '/profile',
        method: 'put',
        data
    })
}

export async function apiPutChangePassword(data: PasswordUpdateModel) {
    return ApiService.fetchData<BooleanResponses>({
        url: '/profile/change-password',
        method: 'put',
        data
    })
}