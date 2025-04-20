import {
    setDrawerOpen,
    useAppDispatch,
    User,
    getUser,
    useAppSelector,
    UserRequestSearch,
    setUserRequestTableData,
} from '../../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { Link } from 'react-router-dom'
import { HiOutlinePencil, HiOutlineEye } from 'react-icons/hi'
import Permissions from '@/constants/authority.constant'
import UserDeleteButton from '../Items/DeleteButton'
import ResendVerificationEmailButton from '../Items/ResendVerificationEmailButton'
import { Tooltip } from '@/components/ui/Tooltip'
import { UserStatusEnum } from '@/constants/userStatus.constant'
import { useTranslation } from 'react-i18next'
import { defaultLocale } from '@/locales'
import ActiveButton from '../Items/ActiveButton'
import DeactivateButton from '../Items/DeactivateButton'

const { UserManagementUpdate } = Permissions

const ActionColumn = ({ row, userAuthority }: { row: User, userAuthority: string[] | undefined }) => {
    const { textTheme } = useThemeClass()
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const tableData = useAppSelector(
        (state) => state.administrator.reducers.UserRequestTableData
    )

    const onEdit = () => {
        dispatch(getUser(row.id ?? ''))
        dispatch(setDrawerOpen())
    }

    const fetchData = (data: UserRequestSearch) => {
        dispatch(setUserRequestTableData(data))
    }

    const reload = () => {
        const newTableData = { ...tableData, isReload: !tableData.isReload }
        fetchData(newTableData)
    }

    return (
        <div className="flex text-lg">
            <Tooltip title={t('UI_ViewDetailUserInfo', { defaultValue: defaultLocale.UI_ViewDetailUserInfo })} placement="bottom">
                <Link className={`cursor-pointer p-2 hover:${textTheme}`} to={`/admin/user/${row.id}`} >
                    <HiOutlineEye />
                </Link>
            </Tooltip>
            {row.status !== UserStatusEnum.Deleted && <>
                {userAuthority?.includes(UserManagementUpdate) &&
                    <Tooltip title={t('UI_EditUser', { defaultValue: defaultLocale.UI_EditUser })} placement="bottom">
                        <span className={`cursor-pointer p-2 hover:${textTheme}`} onClick={onEdit} >
                            <HiOutlinePencil />
                        </span>
                    </Tooltip>}
                {<ResendVerificationEmailButton id={row.id} isIcon={true} name={row.displayName} isEmailVerified={row.isEmailVerified || false} />}
                {<ActiveButton id={row.id} isIcon={true} name={row.displayName} status={row.status} cb={reload} />}
                {<DeactivateButton id={row.id} isIcon={true} name={row.displayName} status={row.status} cb={reload} />}
                {<UserDeleteButton id={row.id} isIcon={true} name={row.displayName} />}
            </>}
        </div>
    )
}

export default ActionColumn