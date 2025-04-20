import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { HiPencilAlt } from 'react-icons/hi';
import {
    getUser,
    Role,
    setDrawerOpen,
    useAppDispatch,
    useAppSelector,
    User,
} from '../../store';
import UserEditDialog from '../UserEditForm/UserEditDialog';
import UserDeleteButton from '../Items/DeleteButton';
import ResendVerificationEmailButton from '../Items/ResendVerificationEmailButton';
import Permissions from '@/constants/authority.constant';
import { UserStatusEnum } from '@/constants/userStatus.constant';
import { Tag } from 'antd';
import ActiveButton from '../Items/ActiveButton';
import DeactivateButton from '../Items/DeactivateButton';
import { useTranslation } from 'react-i18next';
import { defaultLocale } from '@/locales';

type UserInfoFieldProps = {
    title?: string;
    value?: string;
};

type UserProfileProps = {
    data?: Partial<User>;
    roles?: Role[];
};

const UserInfoField = ({ title, value }: UserInfoFieldProps) => {
    return (
        <div>
            <span>{title}</span>
            <p className="text-gray-700 dark:text-gray-200 font-semibold">
                {value}
            </p>
        </div>
    );
};

const RoleInfoField = ({ title, roleIds, roles }: { title: string, roleIds: string[], roles?: Role[] }) => {
    if (!roleIds || roleIds.length === 0 || !roles || roles.length === 0) {
        return null;
    }

    return (
        <div>
            <span>{title}</span>
            <p className="text-gray-700 dark:text-gray-200 font-semibold">
                {roleIds.map(roleId => {
                    const role = roles.find(r => r.id === roleId);
                    return role ? role.name : '';
                }).join(', ')}
            </p>
        </div>
    );
};

const WebApplicationInfoField = ({ title, name, code, t }: { title: string, name: string, code: string, t: Function }) => {
    if (!title || !name || !code) {
        return null;
    }

    return (
        <div>
            <span>{title}</span>
            <p className="text-gray-700 dark:text-gray-200 font-semibold">
                {t('UI_Name', { defaultValue: defaultLocale.UI_Name })}: {name}
            </p>
            <p className="text-gray-700 dark:text-gray-200 font-semibold">
                {t('UI_Code', { defaultValue: defaultLocale.UI_Code })}: {code}
            </p>
        </div>
    );
};

const UserProfileAction = ({ data = {}, roles = [] }: UserProfileProps) => {
    const { id, displayName } = data;
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { authority: userAuthority } = useAppSelector((state) => state.auth.user);
    const { UserManagementUpdate, UserManagementDelete } = Permissions;

    const onEdit = () => {
        dispatch(setDrawerOpen());
    };

    return (
        <>
            {userAuthority?.includes(UserManagementDelete) && <UserDeleteButton id={id} name={displayName} />}
            {userAuthority?.includes(UserManagementUpdate) && <Button
                block
                icon={<HiPencilAlt />}
                variant="solid"
                onClick={onEdit}
            >
                {t('UI_Edit', { defaultValue: defaultLocale.UI_Edit })}
            </Button>}
        </>
    );
};

const UserProfile = ({ data = {}, roles = [] }: UserProfileProps) => {
    const isVerified = data.isEmailVerified || false;
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const updateUserData = () => {
        if (data.id) {
            dispatch(getUser(data.id));
        }
    };

    return (
        <Card>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                <div className="flex xl:flex-col items-center gap-4">
                    <Avatar size={90} shape="circle" src={data.avatar} />
                    <h4 className="font-bold">{data.displayName}</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-8 mb-8">
                    <UserInfoField title={t('UI_Email', { defaultValue: defaultLocale.UI_Email })} value={data.email} />
                    <UserInfoField
                        title={t('UI_Phone', { defaultValue: defaultLocale.UI_Phone })}
                        value={data.phoneNumber}
                    />
                    <UserInfoField
                        title={t('UI_Address', { defaultValue: defaultLocale.UI_Address })}
                        value={data.address}
                    />
                    {roles && roles.length > 0 &&
                        <RoleInfoField
                            title={t('UI_Role', { defaultValue: defaultLocale.UI_Role })}
                            roleIds={data.roleIds || []}
                            roles={roles}
                        />
                    }
                    {data && data.application &&
                        <WebApplicationInfoField
                            title={t('UI_WebApplication', { defaultValue: defaultLocale.UI_WebApplication })}
                            name={data.application.name}
                            code={data.application.code}
                            t={t}
                        />
                    }
                </div>
                {data.status !== UserStatusEnum.Deleted && <>
                    <div className="mt-4 flex flex-col xl:flex-row gap-2">
                        <UserProfileAction data={data} />
                    </div>
                    {!isVerified &&
                        <div className="mt-4 flex flex-col xl:flex-row gap-2">
                            <ResendVerificationEmailButton id={data.id} name={data.displayName} isEmailVerified={false} />
                        </div>}
                    <div className="mt-4 flex flex-col xl:flex-row gap-2">
                        <ActiveButton id={data.id} name={data.displayName} status={data.status ?? UserStatusEnum.Active} cb={updateUserData} />
                    </div>
                    <div className="mt-4 flex flex-col xl:flex-row gap-2">
                        <DeactivateButton id={data.id} name={data.displayName} status={data.status ?? UserStatusEnum.Inactive} cb={updateUserData} />
                    </div>
                </>}

                {data.status === UserStatusEnum.Deleted && <>
                    <div className="mt-4 text-center">
                        <Tag className='text-base' color="red" bordered>{t('UI_AccountDeleted', { defaultValue: defaultLocale.UI_AccountDeleted })}</Tag>
                    </div>
                </>}
            </div>
            <UserEditDialog onCloseDialog={updateUserData} />
        </Card>
    );
};

export default UserProfile;