import { useState } from 'react';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { HiOutlineTrash } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { deleteUser, useAppDispatch } from '../../store';
import { useAppSelector } from '@/store';
import Permissions from '@/constants/authority.constant';
import { Tooltip } from '@/components/ui/Tooltip';
import { useTranslation } from 'react-i18next';
import { defaultLocale } from '@/locales';

const { UserManagementDelete } = Permissions;

const UserDeleteButton = ({ id, isIcon, name }: { id?: string, isIcon?: boolean, name?: string }) => {
    const dispatch = useAppDispatch();
    const [dialogOpen, setDialogOpen] = useState(false);
    const { t } = useTranslation();
    const { authority: userAuthority } = useAppSelector((state) => state.auth.user);

    const deleteAuthority = userAuthority?.includes(UserManagementDelete);

    const navigate = useNavigate();

    const onDialogClose = () => {
        setDialogOpen(false);
    };

    const onDialogOpen = () => {
        setDialogOpen(true);
    };

    const onDelete = () => {
        setDialogOpen(false);
        if (id) {
            dispatch(deleteUser(id));
        }
        navigate('/users');
        toast.push(
            <Notification title={t('UI_SuccessfullyDeleted', { defaultValue: defaultLocale.UI_SuccessfullyDeleted })} type="success">
                {t('UI_UserSuccessfullyDeleted', { defaultValue: `User ${name} successfully deleted` })}
            </Notification>
        );
    };

    return (
        <>
            {deleteAuthority && <>
                {isIcon ?
                    <Tooltip title={t('UI_DeleteUser', { defaultValue: defaultLocale.UI_DeleteUser })} placement="bottom">
                        <span className="cursor-pointer p-2 hover:text-red-500" onClick={onDialogOpen}>
                            <HiOutlineTrash />
                        </span>
                    </Tooltip>
                    :
                    <Button block icon={<HiOutlineTrash />} onClick={onDialogOpen}>
                        {t('UI_Delete', { defaultValue: defaultLocale.UI_Delete })}
                    </Button>
                }
                <ConfirmDialog
                    isOpen={dialogOpen}
                    type="danger"
                    title={t('UI_DeleteUser', { defaultValue: defaultLocale.UI_DeleteUser }) + `: ${name}`}
                    confirmButtonColor="red-600"
                    onClose={onDialogClose}
                    onRequestClose={onDialogClose}
                    onCancel={onDialogClose}
                    onConfirm={onDelete}
                    confirmText={t('UI_Delete', { defaultValue: defaultLocale.UI_Delete })}
                    cancelText={t('UI_Cancel', { defaultValue: defaultLocale.UI_Cancel })}
                >
                    <p>
                        {t('UI_DeleteUserConfirmation', { defaultValue: defaultLocale.UI_DeleteUserConfirmation })}
                    </p>
                </ConfirmDialog>
            </>}
        </>
    );
};

export default UserDeleteButton;