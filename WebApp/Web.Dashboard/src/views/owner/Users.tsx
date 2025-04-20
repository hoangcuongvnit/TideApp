import AdaptableCard from '@/components/shared/AdaptableCard'
import UsersTable from './components/TableView/UsersTable'
import { injectReducer, useAppDispatch } from '@/store'
import { useAppSelector, resetError, resetUserRequestTableData } from './store'
import reducer from './store'
import { useEffect } from 'react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { debounce, isEmpty } from 'lodash'
import UsersTableTools from './components/TableView/UsersTableTools'

injectReducer('owner', reducer)

const Users = () => {
    const dispatch = useAppDispatch()
    const errorMessage = useAppSelector((state) => state.owner.reducers.error)

    const debounceToast = debounce((message: string) => {
        toast.push(
            <Notification title={message} type="danger" />,
            { placement: 'top-center' }
        )
    }, 400)

    useEffect(() => {
        if (errorMessage && !isEmpty(errorMessage)) {
            debounceToast(errorMessage)
            dispatch(resetError())
        }
    }, [errorMessage, dispatch])

    useEffect(() => {
        return () => {
            dispatch(resetUserRequestTableData())
        }
    }, [])

    return (
        <>
            <AdaptableCard className="h-full" bodyClass="h-full">
                <UsersTableTools />
                <UsersTable />
            </AdaptableCard>
        </>
    )
}

export default Users