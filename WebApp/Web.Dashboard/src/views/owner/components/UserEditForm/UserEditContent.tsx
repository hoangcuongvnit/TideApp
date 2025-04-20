import { forwardRef, useCallback, useEffect } from 'react'
import {
    setUserList,
    setDrawerClose,
    useAppDispatch,
    useAppSelector,
    getRoles
} from '../../store'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import UserEditFrom, { FormikRef, FormModel } from '.'
import { debounce } from 'lodash'
import { apiPutUser, apiPutUserPassword } from '@/views/owner/services/OwnerService'
import useMessageErrors from '@/utils/hooks/useMessageErrors'
import { toast, Notification } from '@/components/ui'
import { PasswordStrengthDefault } from './UserEditConstant'
import { useTranslation } from 'react-i18next'
import { defaultLocale } from '@/locales'

type UserEditContentProps = {
    cleanData: () => void
    updateData: (data: any) => void
}

type UpdatingUser = {
    displayName: string
    phoneNumber: string
    address: string
    roleIds: string[]
}

type UpdatingUserModel = UpdatingUser & {
    id: string
    email: string
}

type UpdatingUserPasswordModel = UpdatingUserModel & {
    password: string
}

const UserEditContent = forwardRef<FormikRef, UserEditContentProps>(({ cleanData, updateData }, ref) => {
    const dispatch = useAppDispatch()
    const { t } = useTranslation()

    const { userDetail: user, roles, users } = useAppSelector(
        (state) => state.owner.reducers
    )

    const { id } = user

    const fetchRoleData = useCallback(
        debounce(() => {
            if (!roles || roles.length === 0) {
                dispatch(getRoles())
            }
        }, 300), [roles, dispatch]
    )

    useEffect(() => {
        fetchRoleData()
    }, [])

    const onFormSubmit = (values: FormModel, setErrors: (errors: any) => void) => {
        const {
            displayName,
            phoneNumber,
            address,
            role,
            password
        } = values

        const userDataStoreUpdating = {
            displayName: displayName ?? '',
            phoneNumber: phoneNumber ?? '',
            address: address ?? '',
            roleIds: [role],
        }

        if (users && !isEmpty(users)) {
            let newData = cloneDeep(users)
            newData = newData.map((elm) => {
                if (elm.id === id) {
                    elm = { ...elm, ...userDataStoreUpdating }
                }
                return elm
            })
            dispatch(setUserList(newData))
        }

        if (!password || isEmpty(password) || password === PasswordStrengthDefault) {
            const userDataUpdating = {
                id: id,
                email: user.email,
                displayName: displayName ?? '',
                phoneNumber: phoneNumber ?? '',
                address: address ?? '',
                roleIds: [role],
            } as UpdatingUserModel
            updateUserApi(userDataUpdating, userDataStoreUpdating, false, setErrors)
        } else {
            const userDataUpdating = {
                id: id,
                email: user.email,
                displayName: displayName ?? '',
                phoneNumber: phoneNumber ?? '',
                address: address ?? '',
                roleIds: [role],
                password: password,
            } as UpdatingUserPasswordModel
            updateUserApi(userDataUpdating, userDataStoreUpdating, true, setErrors)
        }
    }

    const setNotification = (message: string, type: 'success' | 'danger') => {
        toast.push(<Notification title={t('UI_UpdateUser', { defaultValue: defaultLocale.UI_UpdateUser })} type={type}>{message}</Notification>, {
            placement: 'top-center',
        })
    }

    const updateUserApi = async (data: UpdatingUserModel | UpdatingUserPasswordModel,
                                 userDataStoreUpdating: UpdatingUser,
                                 withPassword: boolean,
                                 setErrors: (errors: any) => void) => {
        try {
            withPassword ? await apiPutUserPassword(data) : await apiPutUser(data)
            setNotification(t('UI_UpdateUserSuccessfully', { defaultValue: defaultLocale.UI_UpdateUserSuccessfully }), 'success')
            updateData(userDataStoreUpdating)
            cleanData()
            dispatch(setDrawerClose())
        } catch (errors: any) {
            const setMessage = (message: string) => { setNotification(message, 'danger') }
            useMessageErrors(errors, setErrors, setMessage)
        }
    }

    return (
        <>
            {!isEmpty(user) &&
                <UserEditFrom
                    roles={roles}
                    ref={ref}
                    user={user}
                    onFormSubmit={onFormSubmit}
                />}
        </>
    )
})

UserEditContent.displayName = 'UserEditContent'

export type { FormikRef }

export default UserEditContent