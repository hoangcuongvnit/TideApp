import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export interface SessionState {
    signedIn: boolean
    token: string | null
    expires?: number
    roles?: string[]
}

export interface tokenState {
    roles?: string[]
    token: string | null
    expires?: number
}

const initialState: SessionState = {
    signedIn: false,
    token: null,
    roles: [],
    expires: undefined
}

const sessionSlice = createSlice({
    name: `${SLICE_BASE_NAME}/session`,
    initialState,
    reducers: {
        signInSuccess(state, action: PayloadAction<tokenState>) {
            state.signedIn = true
            state.roles = action.payload.roles
            state.token = action.payload.token
            state.expires = action.payload.expires
        },
        signOutSuccess(state) {
            state.signedIn = false
            state.token = null
            state.roles = []
            state.expires = undefined
        },
    },
})

export const { signInSuccess, signOutSuccess } = sessionSlice.actions
export default sessionSlice.reducer
