import { forwardRef, useCallback, useEffect } from 'react'
import reducer, {
    useAppDispatch,
    getRoles,
    getWebApplications,
    useAppSelector
} from './store'
import { injectReducer } from '@/store'
import type { User } from './store'
import Notification from '@/components/ui/Notification'
import UserCreateForm, { FormikRef, UserCreateFormModel, UserCreateRequest } from './components/UserCreateForm'
import toast from '@/components/ui/toast'
import { apiPostCreateUser } from '@/views/owner/services/OwnerService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useNavigate } from 'react-router-dom'
import { debounce, orderBy } from 'lodash'
import useMessageErrors from '@/utils/hooks/useMessageErrors'
import { ApiResponses } from '@/@types/apiResponses'

injectReducer('owner', reducer)

const CreateUser = forwardRef<FormikRef>((_, ref) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [message, setMessage] = useTimeOutMessage()

    const {roles, webApps} = useAppSelector(
        (state) => state.owner.reducers
    )

    const fetchRoleData = useCallback(
        debounce(() => {
            dispatch(getRoles())
        }, 300), [dispatch])

    useEffect(() => {
        if (!roles || roles.length === 0) {
            fetchRoleData()
        }
    }, [roles, fetchRoleData])

    const fetchWebAppData = useCallback(
        debounce(() => {
            dispatch(getWebApplications())
        }, 300), [dispatch])

    useEffect(() => {
        fetchWebAppData()
    }, [fetchWebAppData])

    const user: UserCreateFormModel = {
        displayName: '',
        email: '',
        img: '',
        phoneNumber: '',
        address: '',
        roleId: '',
        password: ''
    }

    const onFormSubmit = async (values: UserCreateFormModel, setErrors: (errors: any) => void) => {
        try {
            const { roleId, ...rest } = values
            const data: UserCreateRequest = { ...rest, roleIds: [roleId] }
            const resp = await apiPostCreateUser<ApiResponses<User>, UserCreateRequest>(data)

            toast.push(<Notification title={'Create user'} type="success" />, {
                placement: 'top-center',
            })
            navigate(`/user/${resp.data.results.id}`)
        } catch (errors: any) {
            useMessageErrors(errors, setErrors, setMessage)
        }
    }

    return (
        <>
            <UserCreateForm
                ref={ref}
                roles={orderBy(roles, ['order'], ['asc'])}
                user={user}
                message={message}
                onFormSubmit={onFormSubmit}
            />
        </>
    )
})

CreateUser.displayName = 'CreateUser'

export type { FormikRef }

export default CreateUser
