import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useAuth from '@/utils/hooks/useAuth'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineLogout, HiOutlineUser } from 'react-icons/hi'
import { RiLockPasswordLine } from 'react-icons/ri'
import type { CommonProps } from '@/@types/common'
import { useAppSelector } from '@/store'
import { useTranslation } from 'react-i18next'
import { defaultLocale } from '@/locales/locales'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const _UserDropdown = ({ className }: CommonProps) => {
    const { t } = useTranslation()
    const { signOut } = useAuth()
    const user = useAppSelector((state) => state.auth.user)

    const dropdownItemList: DropdownList[] = [
        {
            label: t('UI_Profile', { defaultValue: defaultLocale.UI_Profile }),
            path: '/account/profile',
            icon: <HiOutlineUser />,
        },
        {
            label: t('UI_Password', { defaultValue: defaultLocale.UI_Password }),
            path: '/account/password',
            icon: <RiLockPasswordLine />,
        }
    ]

    const UserAvatar = (
        <div className={classNames(className, 'flex items-center gap-2')}>
            <Avatar size={32} shape="circle" icon={<HiOutlineUser />} />
            <div className="hidden md:block">
                <div className="text-xs capitalize">{user.role}</div>
                <div className="font-bold">{user.displayName}</div>
            </div>
        </div>
    )

    return (
        <div>
            <Dropdown
                menuStyle={{ minWidth: 240 }}
                renderTitle={UserAvatar}
                placement="bottom-end"
            >
                <Dropdown.Item variant="header">
                    <div className="py-2 px-3 flex items-center gap-2">
                        <Avatar shape="circle" icon={<HiOutlineUser />} />
                        <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100">
                                {user.displayName}
                            </div>
                            <div className="text-xs">{user.email}</div>
                        </div>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item variant="divider" />
                {dropdownItemList.map((item) => (
                    <Dropdown.Item
                        key={item.label}
                        eventKey={item.label}
                        className="mb-1 px-0"
                    >
                        <Link 
                            className="flex h-full w-full px-2" 
                            to={item.path}
                        >
                            <span className="flex gap-2 items-center w-full">
                                <span className="text-xl opacity-50">
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </span>
                        </Link>
                    </Dropdown.Item>
                ))}
                <Dropdown.Item variant="divider" />
                <Dropdown.Item
                    eventKey="Sign Out"
                    className="gap-2"
                    onClick={signOut}
                >
                    <span className="text-xl opacity-50">
                        <HiOutlineLogout />
                    </span>
                    <span>{t('UI_SignOut', { defaultValue: defaultLocale.UI_SignOut })}</span>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown