import { useState } from 'react';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { HiOutlineLockClosed } from 'react-icons/hi';
import { apiDeactivateUser } from '@/views/administrator/services/UserService';
import { includes } from 'lodash';
import { SUCCESS_STATUS } from '@/constants/app.constant';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@/components/ui/Tooltip';
import { UserStatusEnum } from '@/constants/userStatus.constant';
import { defaultLocale } from '@/locales';

const DeactivateButton = ({ id, isIcon, name, status, cb }: { id?: string, isIcon?: boolean, name?: string, status: number, cb: () => void }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { t } = useTranslation();

    const onDialogClose = () => {
        setDialogOpen(false);
    };

    const onDialogOpen = () => {
        setDialogOpen(true);
    };

    const onDeactivateUser = async () => {
        setDialogOpen(false);
        if (id) {
            try {
                const resp = await apiDeactivateUser(id);
                if (resp.status && includes(SUCCESS_STATUS, resp.status)) {
                    toast.push(
                        <Notification title={t('UI_SuccessfullyDeactivatedUser', { defaultValue: defaultLocale.UI_SuccessfullyDeactivatedUser })} type="success">
                            {t('UI_UserSuccessfullyDeactivated', { defaultValue: `User ${name} successfully deactivated` })}
                        </Notification>
                    );
                }
                cb();
            } catch (errors) {
                const message = (errors as AxiosError<{ message: string }>)?.response?.data?.message || (errors as Error).toString();
                toast.push(
                    <Notification title={t('UI_FailedToDeactivateUser', { defaultValue: defaultLocale.UI_FailedToDeactivateUser })} type="danger">
                        {t('UI_UserDeactivationError', { defaultValue: `User ${name}: ${message}` })}
                    </Notification>
                );
            }
        }
    };

    return (
        <>
            {status === UserStatusEnum.Active && <>
                {isIcon ?
                    <Tooltip title={t('UI_DeactivateUser', { defaultValue: defaultLocale.UI_DeactivateUser })} placement="bottom">
                        <span className="cursor-pointer p-2 hover:text-red-500" onClick={onDialogOpen}>
                            <HiOutlineLockClosed />
                        </span>
                    </Tooltip>
                    :
                    <Button block icon={<HiOutlineLockClosed />} onClick={onDialogOpen}>
                        {t('UI_DeactivateUser', { defaultValue: defaultLocale.UI_DeactivateUser })}
                    </Button>
                }
                <ConfirmDialog
                    isOpen={dialogOpen}
                    type="danger"
                    title={t('UI_DeactivateUser', { defaultValue: defaultLocale.UI_DeactivateUser }) + `: ${name}`}
                    confirmButtonColor="red-600"
                    onClose={onDialogClose}
                    onRequestClose={onDialogClose}
                    onCancel={onDialogClose}
                    onConfirm={onDeactivateUser}
                    confirmText={t('UI_DeactivateUser', { defaultValue: defaultLocale.UI_DeactivateUser })}
                    cancelText={t('UI_Cancel', { defaultValue: defaultLocale.UI_Cancel })}
                >
                    <p>
                        {t('UI_DeactivateUserConfirmation', { defaultValue: defaultLocale.UI_DeactivateUserConfirmation })}
                    </p>
                </ConfirmDialog>
            </>}
        </>
    );
};

export default DeactivateButton;