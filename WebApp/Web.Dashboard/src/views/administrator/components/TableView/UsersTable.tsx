import { useEffect, useCallback, useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import DataTable from '@/components/shared/DataTable'
import {
    getUsers,
    setUserRequestTableData,
    useAppDispatch,
    useAppSelector,
    User,
    UserRequestSearch,
    Role,
    setUserDetail,
} from '../../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import UserEditDialog from '../UserEditForm/UserEditDialog'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'
import { HiOutlineUser } from 'react-icons/hi'
import { Tag, Spinner } from '@/components/ui'
import { UserStatus, UserStatusColor } from '@/constants/userStatus.constant'
import { debounce, find, map } from 'lodash'
import { useTranslation } from 'react-i18next'
import { defaultLocale } from '@/locales'
import ActionColumn from './ActionColumn'

const NameColumn = ({ row }: { row: User }) => {
    const { textTheme } = useThemeClass()

    return (
        <div className='flex items-center min-w-40'>
            <Avatar size={28} shape='circle' icon={<HiOutlineUser />} />
            <Link
                className={`hover:${textTheme} ml-2 rtl:mr-2 font-semibold`}
                to={`/admin/user/${row.id}`}
            >
                {row.displayName}
            </Link>
        </div>
    )
}

const UserStatusColumn = ({ row, t }: { row: User, t: Function }) => {
    return (
        <div className='flex items-center'>
            <Tag className={`${UserStatusColor[row.status]} text-white border-0`} >
                {t('UI_' + UserStatus[row.status])}
            </Tag>
        </div>
    )
}

const RolesColumn = ({ row, roles, t }: { row: User, roles: Role[], t: Function }) => {
    return (
        <div className='flex items-center'>
            {map(row.roleIds, (roleId) => {
                const role = find(roles, (r) => r.id === roleId)
                if (!role) return null
                return (
                    <Tag key={roleId}>
                        {t(`UI_${role.localeKey}`, role.name)}
                    </Tag>
                )
            })}
        </div>
    )
}

const UsersTable = () => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const data = useAppSelector((state) => state.administrator.reducers.users)
    const roles = useAppSelector((state) => state.administrator.reducers.roles)
    const loading = useAppSelector((state) => state.administrator.reducers.loading)
    const { authority: userAuthority } = useAppSelector((state) => state.auth.user)

    const { pagination: { page: pageIndex, size: pageSize, sortBy, isDescending }, filter, isReload } = useAppSelector(
        (state) => state.administrator.reducers.UserRequestTableData
    )
    const totalRecords = useAppSelector(
        (state) => state.administrator.reducers.totalRecords
    )

    const fetchData = useCallback(
        debounce(() => {
            const getdatas = { pagination: { page: pageIndex, size: pageSize, sortBy, isDescending }, filter }
            dispatch(getUsers(getdatas))
        }, 300), [pageIndex, pageSize, sortBy, isDescending, filter, isReload, dispatch])

    useEffect(() => {
        fetchData()
    }, [fetchData, pageIndex, pageSize, sortBy, isDescending, filter, isReload])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort: { order: isDescending, key: sortBy } }),
        [pageIndex, pageSize, sortBy, isDescending]
    )

    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                header: t('UI_DisplayName', { defaultValue: defaultLocale.UI_DisplayName }),
                accessorKey: 'displayName',
                cell: (props) => {
                    const row = props.row.original
                    return <NameColumn row={row} />
                },
            },
            {
                header: t('UI_Email', { defaultValue: defaultLocale.UI_Email }),
                accessorKey: 'email',
            },
            {
                header: t('UI_Roles', { defaultValue: defaultLocale.UI_Roles }),
                cell: (props) => {
                    const row = props.row.original
                    return <RolesColumn row={row} roles={roles} t={t} />
                },
            },
            {
                header: t('UI_Status', { defaultValue: defaultLocale.UI_Status }),
                accessorKey: 'status',
                cell: (props) => {
                    const row = props.row.original
                    return <UserStatusColumn row={row} t={t} />
                },
            },
            {
                header: t('UI_CreatedAt', { defaultValue: defaultLocale.UI_CreatedAt }),
                accessorKey: 'createdAt',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className='flex items-center'>
                            {dayjs(row.createdAt).format('MM/DD/YYYY')}
                        </div>
                    )
                },
            },
            {
                header: t('UI_Action', { defaultValue: defaultLocale.UI_Action }),
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} userAuthority={userAuthority} />,
            },
        ],
        [roles, userAuthority, t]
    )

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        const newTableDataMap: UserRequestSearch = {
            pagination: {
                page: newTableData.pageIndex,
                size: newTableData.pageSize,
                sortBy: newTableData.sort.key,
                isDescending: newTableData.sort.order
            },
            filter: filter
        }
        dispatch(setUserRequestTableData(newTableDataMap))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        const newTableDataMap: UserRequestSearch = {
            pagination: {
                page: newTableData.pageIndex,
                size: newTableData.pageSize,
                sortBy: newTableData.sort.key,
                isDescending: newTableData.sort.order
            },
            filter: filter
        }
        dispatch(setUserRequestTableData(newTableDataMap))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = { key: sort.key, order: sort.order === 'desc' }
        const newTableDataMap: UserRequestSearch = {
            pagination: {
                page: newTableData.pageIndex,
                size: newTableData.pageSize,
                sortBy: newTableData.sort.key,
                isDescending: newTableData.sort.order
            },
            filter: filter
        }
        dispatch(setUserRequestTableData(newTableDataMap))
    }

    const cleanUserDetail = () => {
        dispatch(setUserDetail({}))
    }

    return (
        <>
            {!roles || roles.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                    <Spinner size="lg" />
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    emptyText={t('UI_NoDataFound', { defaultValue: defaultLocale.UI_NoDataFound })}
                    skeletonAvatarColumns={[0]}
                    skeletonAvatarProps={{ width: 28, height: 28 }}
                    loading={loading}
                    pagingData={{
                        total: totalRecords as number,
                        pageIndex: tableData.pageIndex as number,
                        pageSize: tableData.pageSize as number,
                    }}
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onSelectChange}
                    onSort={onSort}
                />
            )}
            <UserEditDialog onCloseDialog={cleanUserDetail} />
        </>
    )
}

export default UsersTable