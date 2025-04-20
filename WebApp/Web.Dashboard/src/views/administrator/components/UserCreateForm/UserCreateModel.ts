export type UserCreateRequest = {
    displayName: string
    email: string
    img: string
    phoneNumber: string
    address: string
    roleIds: string[]
    webApplication: string | null
    password: string
}

export type UserCreateFormModel = {
    displayName: string
    email: string
    img: string
    phoneNumber: string
    address: string
    roleId: string
    webApplication: string | null
    password: string
}