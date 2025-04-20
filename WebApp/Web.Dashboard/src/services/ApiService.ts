import BaseService from './BaseService'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const ApiService = {
    fetchData<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>
    ) {
        return new Promise<AxiosResponse<Response>>((resolve, reject) => {
            BaseService(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response)
                })
                .catch((errors: AxiosError) => {
                    const { errors : errorObjects } = errors?.response?.data as { errors: unknown };
                    reject(errors.response?.data ? errorObjects : {'AxiosError': [{ message: errors.message, key: 'error' }]})
                })
        })
    },
}

export default ApiService
