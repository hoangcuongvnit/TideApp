export interface ApiResponses<T> {
    results: T
    messages: {
        message: string
        key: string
    }
}

export type BooleanResponses = ApiResponses<boolean>