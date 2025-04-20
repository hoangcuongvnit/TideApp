import { ApiResponses, BooleanResponses } from './apiResponses'

export type SignInCredential = {
    email: string
    password: string
}

export type PermissionModel = {
    id: string
    name: string
    description: string
    group: string
}

type SignInResult = {
    token: string
    avatar: string
}

export interface TokenData {
    userId: string
    email: string
    sub?: string
    exp?: number
    userName?: string
    status?: string
    avatar?: string
    displayName?: string
    roles?: string
    authority?: string
}

export type SignInResponse = ApiResponses<SignInResult>

export type SignUpResponse = ApiResponses<string>
export type VerifyResponse = BooleanResponses

export type SignUpCredential = {
    email: string
    password: string
    displayName: string
    address: string
    phoneNumber: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    token: string
    password: string
}

export type VerifyEmail = {
    id: string
    token: string
}
