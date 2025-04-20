import ApiService from '@/services/ApiService'

export async function apiPostSearchUsers<ResponseModel, RequestModel extends Record<string, unknown>>(
    data: RequestModel
) {
    return ApiService.fetchData<ResponseModel>({
        url: 'user/search',
        method: 'post',
        data,
    })
}

export async function apiGetPermission<T>() {
    return ApiService.fetchData<T>({
        url: 'role/webapp/claims',
        method: 'get',
    })
}

export async function apiGetUser<T>(id: string) {
    return ApiService.fetchData<T>({
        url: `user/${id}`,
        method: 'get',
    })
}

export async function apiDeleteUser(id: string) {
    return ApiService.fetchData({
        url: `user/${id}`,
        method: 'delete',
    })
}

export async function apiResendVerificationEmailUser(id: string) {
    return ApiService.fetchData({
        url: `user/resend/${id}`,
        method: 'get',
    })
}

export async function apiActivateUser(id: string) {
    return ApiService.fetchData({
        url: `user/activate/${id}`,
        method: 'patch',
    })
}

export async function apiDeactivateUser(id: string) {
    return ApiService.fetchData({
        url: `user/deactivate/${id}`,
        method: 'patch',
    })
}

export async function apiGetRoles<T>() {
    return ApiService.fetchData<T>({
        url: `role/webapp/all`,
        method: 'get',
    })
}

export async function apiGetWebApplications<T>() {
    return ApiService.fetchData<T>({
        url: `webapp/all`,
        method: 'get',
    })
}

export async function apiPutUser<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `user`,
        method: 'put',
        data,
    })
}

export async function apiPutUserPassword<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `user/password`,
        method: 'put',
        data,
    })
}

export async function apiPostCreateUser<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `user`,
        method: 'Post',
        data,
    })
}

export async function apiPatchUserPermissions<T, U extends Record<string, unknown>>(
    dataU: U
) {
    const {permissionIds, id} = dataU
    const data = { permissions: permissionIds }
    return ApiService.fetchData<T>({
        url: `admin/users/${id}/permissions`,
        method: 'patch',
        data,
    })
}

export async function apiGetUserDetails<
    T,
    U extends Record<string, unknown>
>(params: U) {
    return ApiService.fetchData<T>({
        url: '/crm/customer-details',
        method: 'get',
        params,
    })
}
