import ApiService from '../../../services/ApiService'

export async function apiPostSearchUsers<ResponseModel, RequestModel extends Record<string, unknown>>(
    data: RequestModel
) {
    return ApiService.fetchData<ResponseModel>({
        url: 'adminuser/search',
        method: 'post',
        data,
    })
}

export async function apiGetPermission<T>() {
    return ApiService.fetchData<T>({
        url: 'role/claims',
        method: 'get',
    })
}

export async function apiGetUser<T>(id: string) {
    return ApiService.fetchData<T>({
        url: `adminuser/${id}`,
        method: 'get',
    })
}

export async function apiDeleteUser(id: string) {
    return ApiService.fetchData({
        url: `adminuser/${id}`,
        method: 'delete',
    })
}

export async function apiResendVerificationEmailUser(id: string) {
    return ApiService.fetchData({
        url: `adminuser/resend/${id}`,
        method: 'get',
    })
}

export async function apiActivateUser(id: string) {
    return ApiService.fetchData({
        url: `adminuser/activate/${id}`,
        method: 'patch',
    })
}

export async function apiDeactivateUser(id: string) {
    return ApiService.fetchData({
        url: `adminuser/deactivate/${id}`,
        method: 'patch',
    })
}

export async function apiGetRoles<T>() {
    return ApiService.fetchData<T>({
        url: `roles`,
        method: 'get',
    })
}

export async function apiGetWebApplications<T>() {
    return ApiService.fetchData<T>({
        url: `webapp/all`,
        method: 'get',
    })
}

export async function apiGetUsersStatistic<T>() {
    return ApiService.fetchData<T>({
        url: `adminuser/statistic`,
        method: 'get',
    })
}

export async function apiPutUser<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `adminuser`,
        method: 'put',
        data,
    })
}

export async function apiPutUserPassword<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `adminuser/password`,
        method: 'put',
        data,
    })
}

export async function apiPostCreateUser<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `adminuser`,
        method: 'Post',
        data,
    })
}
