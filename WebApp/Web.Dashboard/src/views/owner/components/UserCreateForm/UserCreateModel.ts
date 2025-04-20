export type UserCreateRequest = {
    displayName: string
    email: string
    img: string
    phoneNumber: string
    address: string
    roleIds: string[]
    password: string
}

export type UserCreateFormModel = {
    displayName: string
    email: string
    img: string
    phoneNumber: string
    address: string
    roleId: string
    password: string
}