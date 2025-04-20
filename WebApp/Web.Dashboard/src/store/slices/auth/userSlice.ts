import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
    id: string
    email: string
    address?: string
    title?: string
    avatar?: string
    displayName?: string
    phoneNumber?: string
    role?: string
    isEmailVerified?: boolean
    isPasswordChanged?: boolean
    authority?: string[]
}

const initialState: UserState = {
    id: '',
    email: '',
    address: '',
    title: '',
    avatar: '',
    displayName: '',
    phoneNumber: '',
    role: '',
    authority: []
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.id = action.payload.id,
            state.email = action.payload.email,
            state.address = action.payload.address,
            state.title = action.payload.title,
            state.avatar = action.payload.avatar,
            state.displayName = action.payload?.displayName,
            state.phoneNumber = action.payload?.phoneNumber,
            state.role = action.payload?.role
            state.isEmailVerified = action.payload?.isEmailVerified,
            state.isPasswordChanged = action.payload?.isPasswordChanged,
            state.authority = action.payload?.authority
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
