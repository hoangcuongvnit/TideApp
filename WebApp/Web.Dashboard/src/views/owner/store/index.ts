import { combineReducers } from '@reduxjs/toolkit'
import reducers, { SLICE_NAME, OwnerState } from './OwnerUserSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({ reducers })

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            reducers: OwnerState
        }
    }
> = useSelector

export * from './OwnerUserSlice'
export { useAppDispatch } from '@/store'
export default reducer
