import { combineReducers } from '@reduxjs/toolkit'
import reducers, { SLICE_NAME, AdministratorState } from './ManagerUserSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({ reducers })

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            reducers: AdministratorState
        }
    }
> = useSelector

export * from './ManagerUserSlice'
export { useAppDispatch } from '@/store'
export default reducer
