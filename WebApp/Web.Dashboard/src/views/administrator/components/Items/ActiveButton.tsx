import { useState } from 'react';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { HiOutlineLockOpen } from 'react-icons/hi';
import { apiActivateUser } from '@/views/administrator/services/UserService';
import { includes } from 'lodash';
import { SUCCESS_STATUS } from '@/constants/app.constant';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@/components/ui/Tooltip';
import { UserStatusEnum } from '@/constants/userStatus.constant';
import { defaultLocale } from '@/locales';

const ActiveButton = ({ id, isIcon, name, status, cb }: { id?: string, isIcon?: boolean, name?: string, status: number, cb: () => void }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { t } = useTranslation();

    const onDialogClose = () => {
        setDialogOpen(false);
    };

    const onDialogOpen = () => {
        setDialogOpen(true);
    };

    const onActivateUser = async () => {
        setDialogOpen(false);
        if (id) {
            try {
                const resp = await apiActivateUser(id);
                if (resp.status && includes(SUCCESS_STATUS, resp.status)) {
                    toast.push(
                        <Notification title={t('UI_SuccessfullyActivatedUser', { defaultValue: defaultLocale.UI_SuccessfullyActivatedUser })} type="success">
                            {t('UI_UserSuccessfullyActivated', { defaultValue: `User ${name} successfully activated` })}
                        </Notification>
                    );
                }
                cb();
            } catch (errors) {
                const message = (errors as AxiosError<{ message: string }>)?.response?.data?.message || (errors as Error).toString();
                toast.push(
                    <Notification title={t('UI_FailedToActivateUser', { defaultValue: defaultLocale.UI_FailedToActivateUser })} type="danger">
                        {t('UI_UserActivationError', { defaultValue: `User ${name}: ${message}` })}
                    </Notification>
                );
            }
        }
    };

    return (
        <>
            {status !== UserStatusEnum.Active && <>
                {isIcon ?
                    <Tooltip title={t('UI_ActivateUser', { defaultValue: defaultLocale.UI_ActivateUser })} placement="bottom">
                        <span className="cursor-pointer p-2 hover:text-green-500" onClick={onDialogOpen}>
                            <HiOutlineLockOpen />
                        </span>
                    </Tooltip>
                    :
                    <Button block icon={<HiOutlineLockOpen />} onClick={onDialogOpen}>
                        {t('UI_ActivateUser', { defaultValue: defaultLocale.UI_ActivateUser })}
                    </Button>
                }
                <ConfirmDialog
                    isOpen={dialogOpen}
                    type="danger"
                    title={t('UI_ActivateUser', { defaultValue: defaultLocale }) + `: ${name}`}
                    confirmButtonColor="green-600"
                    onClose={onDialogClose}
                    onRequestClose={onDialogClose}
                    onCancel={onDialogClose}
                    onConfirm={onActivateUser}
                    confirmText={t('UI_Activate', { defaultValue: defaultLocale.UI_Activate })}
                    cancelText={t('UI_Cancel', { defaultValue: defaultLocale.UI_Cancel })}
                >
                    <p>
                        {t('UI_ActivateUserConfirmation', { defaultValue: defaultLocale.UI_ActivateUserConfirmation })}
                    </p>
                </ConfirmDialog>
            </>}
        </>
    );
};

export default ActiveButton;