import { ApiResponses } from "./apiResponses"

export type AccountResponse = {
    profile: ProfileModel
    loginHistory?: LoginHistoryModel[]
    notification?: NotificationModel
}

export type ProfileModel = {
    id: string
    email: string
    phoneNumber?: string
    displayName?: string
    status?: number
    avatar?: string
    profileUrl?: string
    description?: string
    title?: string
    address?: string
    birthDate?: Date
}

export type ProfileResponse = ApiResponses<ProfileModel>

export type ProfileUpdateModel = {
    id: string
    email: string
    displayName?: string
    phoneNumber?: string
    address?: string
}

export type PasswordUpdateModel = {
    currentPassword: string
    newPassword: string
}

export type LoginHistoryModel = {
    type: string
    deviceName: string
    time: number
    location: string
}

export type NotificationModel = {
    news: string[]
    accountActivity: string[]
    signIn: string[]
    reminders: string[]
    mentioned: string[]
    replies: string[]
    taskUpdate: string[]
    assigned: string[]
    newProduct: string[]
    newOrder: string[]
}