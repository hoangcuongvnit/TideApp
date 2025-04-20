export const UserStatus = [
    'Active',
    'Inactive',
    'PendingApproval',
    'AwaitingVerification',
    'Deleted'
] as string[]

export const UserStatusEnum = {
    Active: 0,
    Inactive: 1,
    PendingApproval: 2,
    AwaitingVerification: 3,
    Deleted: 4
}

export const UserStatusEnumIndex = [
    UserStatusEnum.Active,
    UserStatusEnum.Inactive,
    UserStatusEnum.PendingApproval,
    UserStatusEnum.AwaitingVerification,
    UserStatusEnum.Deleted
] as number[]

export const UserStatusColor = [
    'bg-blue-500', //Active
    'bg-red-500', //Inactive
    'bg-amber-500', //PendingApproval
    'bg-orange-500', //AwaitingVerification
    'bg-gray-500', //Deleted
] as string[]