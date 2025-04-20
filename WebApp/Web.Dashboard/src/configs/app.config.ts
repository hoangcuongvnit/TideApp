export type AppConfig = {
    apiPrefix: string,
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string,
    authenticatedPublisherEntryPath: string,
    verifyEmailPath: string
    tourPath: string
    locale: string
    enableMock: boolean
}
export const ApiStatus = {
    success: 'success',
    failed: 'failed'
}

export const ApiErrorKeyDefault = 'general'

export type ErrorDetails = {
    message: string,
    key: string
}

export type ApiResponses = {
    status: string
    results?: any
    errors?: {
        [key: string]: ErrorDetails[] | []
    }
}

const appConfig: AppConfig = {
    apiPrefix: '/v1',
    authenticatedEntryPath: '/home',
    authenticatedPublisherEntryPath: '/home',
    unAuthenticatedEntryPath: '/sign-in',
    verifyEmailPath: '/verify-email',
    tourPath: '/',
    locale: 'en',
    enableMock: false,
}

export default appConfig
