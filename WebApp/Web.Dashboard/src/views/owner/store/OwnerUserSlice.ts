import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiPostSearchUsers,
    apiGetPermission,
    apiGetUser,
    apiPatchUserPermissions,
    apiGetRoles,
    apiGetWebApplications,
    apiDeleteUser
} from '../services/OwnerService'
import { remove } from 'lodash'
import { ApiResponses } from '@/@types/apiResponses'
import useMessageErrors from '@/utils/hooks/useMessageErrors'

export type UserRequestSearch = {
    filter?: {
        role?: string
        name?: string
        email?: string
        phoneNumber?: string
        status?: number
    }
    pagination: {
        sortBy: string | number
        isDescending: boolean
        size: number
        page: number
    }
    isReload?: boolean
}

export type UserDataTable = {
    id: string
    displayName: string
    email: string
    avatar: string
    phoneNumber: string
    address: string
    isEmailVerified: boolean
    status: number
    roleIds?: string[]
    createdAt?: string
    updatedAt?: string
}

export type User = {
    id: string
    displayName: string
    email: string
    avatar: string
    phoneNumber: string
    address: string
    status: number
    isEmailVerified: boolean
    roleIds: string[]
    roleClaims: string[]
    profileUrl?: string
    description?: string
    title?: string
    application?: WebApplication
    createdAt?: string
    updatedAt?: string
}

export type Role = {
    id: string
    name: string
    localeKey: string
    description: string
    order: number
}

export type WebApplication = {
    id: string
    name: string
    code: string
    description: string
}

type UsersResponse = {
    totalRecords: number
    users: UserDataTable[]
    roles: Role[]
}

export type Subscription = {
    plan: string
    status: string
    billing: string
    nextPaymentDate: number
    amount: number
}

export type TokenPublisherModel = {
    access: {
        token: string,
        expires: string
    }
    refresh: {
        token: string,
        expires: string
    }
}

export type PublisherDataModel = Partial<{
    user: User
    tokens: TokenPublisherModel
}>

export type OwnerState = {
    loading: boolean
    error: string
    users: UserDataTable[]
    totalRecords: number
    UserRequestTableData: UserRequestSearch
    drawerOpen: boolean
    userDetail: Partial<User>
    claims: string[]
    roles: Role[]
    webApps: WebApplication[]
    subscriptionData: Subscription[]
}

export const SLICE_NAME = 'owner'

export const getUsers = createAsyncThunk(
    'owner/postSearchUsers',
    async (data: UserRequestSearch, { rejectWithValue }) => {
        try {
            const response = await apiPostSearchUsers<
                ApiResponses<UsersResponse>,
                UserRequestSearch
            >(data)
            return response.data
        }
        catch (errors: any) {
            const errorMessage = useMessageErrors(errors)
            return rejectWithValue(errorMessage)
        }
    }
)

export const getClaims = createAsyncThunk(
    'owner/getClaims',
    async () => {
        const response = await apiGetPermission<ApiResponses<string[]>>()
        return response.data
    }
)

export const getUser = createAsyncThunk(
    'owner/getUser',
    async (id: string) => {
        const response = await apiGetUser<ApiResponses<User>>(id)
        return response.data
    }
)

export const deleteUser = createAsyncThunk(
    'owner/deleteUser',
    async (id: string) => {
        await apiDeleteUser(id)
        return { id }
    }
)

export const getRoles = createAsyncThunk(
    'owner/getRoles',
    async () => {
        const response = await apiGetRoles<ApiResponses<Role[]>>()
        return response.data
    }
)

export const getWebApplications = createAsyncThunk(
    'owner/getWebApplications',
    async () => {
        const response = await apiGetWebApplications<ApiResponses<WebApplication[]>>()
        return response.data
    }
)

export const patchUserPermissions = createAsyncThunk(
    'owner/patchUserPermissions',
    async (data: User) => {
        const response = await apiPatchUserPermissions(data)
        return response.data
    }
)

export const initialTabledatas: UserRequestSearch = {
    filter: {
    },
    pagination: {
        sortBy: 'createdAt',
        isDescending: true,
        size: 10,
        page: 1,
    },
}

export const initialUserRequestSearch: UsersResponse = {
    totalRecords: 0,
    users: [],
    roles: []
}

export const initialFilterData = {}

const initialState: OwnerState = {
    loading: false,
    error: '',
    users: [],
    totalRecords: 0,
    UserRequestTableData: initialTabledatas,
    drawerOpen: false,
    userDetail: {},
    roles: [],
    webApps: [],
    claims: [],
    subscriptionData: [{
        plan: "Business board pro",
        status: "active",
        billing: "monthly",
        nextPaymentDate: 1639132800,
        amount: 59.9,
    }]
}

const managerUserSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = ''
        },
        setUserRequestTableData: (state, action) => {
            state.UserRequestTableData = action.payload
        },
        resetUserRequestTableData: (state) => {
            state.UserRequestTableData = initialTabledatas
        },
        setUserList: (state, action) => {
            state.users = action.payload
        },
        setUserDetail: (state, action) => {
            state.userDetail = action.payload
        },
        setDrawerOpen: (state) => {
            state.drawerOpen = true
        },
        setDrawerClose: (state) => {
            state.drawerOpen = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.loading = true
                state.error = ''
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.users = action.payload.results.users
                state.roles = action.payload.results.roles
                state.totalRecords = action.payload.results.totalRecords
                state.loading = false
                state.error = ''
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string || action.error.message || 'UI_FailedToFetchUsers'
            })
            .addCase(getUser.pending, (state) => {
                state.loading = true
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.userDetail = action.payload.results
                state.loading = false
            })
            .addCase(getUser.rejected, (state) => {
                state.userDetail = {id: ''}
                state.loading = false
            })
            .addCase(getRoles.fulfilled, (state, action) => {
                state.roles = action.payload.results
            })
            .addCase(getClaims.fulfilled, (state, action) => {
                state.claims = action.payload.results
            })
            .addCase(getWebApplications.fulfilled, (state, action) => {
                state.webApps = action.payload.results
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                let users = [...state.users]
                remove(users, (item) => item.id === action.payload.id)
                state.users = users
            })
    },
})

export const {
    resetError,
    setUserRequestTableData,
    resetUserRequestTableData,
    setUserList,
    setUserDetail,
    setDrawerOpen,
    setDrawerClose,
} = managerUserSlice.actions

export default managerUserSlice.reducer
