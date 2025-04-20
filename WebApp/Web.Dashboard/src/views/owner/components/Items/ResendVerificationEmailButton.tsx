import { useState } from 'react';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { HiOutlineMail } from 'react-icons/hi';
import { apiResendVerificationEmailUser } from '@/views/owner/services/OwnerService';
import { includes } from 'lodash';
import { SUCCESS_STATUS } from '@/constants/app.constant';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@/components/ui/Tooltip';
import { defaultLocale } from '@/locales';

const ResendVerificationEmailButton = ({ id, isIcon, name, isEmailVerified = true }: { id?: string, isIcon?: boolean, name?: string, isEmailVerified?: boolean }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { t } = useTranslation();

    const onDialogClose = () => {
        setDialogOpen(false);
    };

    const onDialogOpen = () => {
        setDialogOpen(true);
    };

    const onResendVerificationEmail = async () => {
        setDialogOpen(false);
        if (id) {
            try {
                const resp = await apiResendVerificationEmailUser(id);
                if (resp.status && includes(SUCCESS_STATUS, resp.status)) {
                    toast.push(
                        <Notification title={t('UI_SuccessfullyResendVerificationEmail', { defaultValue: defaultLocale.UI_SuccessfullyResendVerificationEmail })} type="success">
                            {t('UI_UserSuccessfullyResendVerificationEmail', { defaultValue: `User ${name} successfully resend verification email` })}
                        </Notification>
                    );
                }
            } catch (errors) {
                const message = (errors as AxiosError<{ message: string }>)?.response?.data?.message || (errors as Error).toString();
                toast.push(
                    <Notification title={t('UI_FailedResendVerificationEmail', { defaultValue: defaultLocale.UI_FailedResendVerificationEmail })} type="danger">
                        {t('UI_UserResendVerificationEmailError', { defaultValue: `User ${name}: ${message}` })}
                    </Notification>
                );
            }
        }
    };

    return (
        <>
            {!isEmailVerified && <>
                {isIcon ?
                    <Tooltip title={t('UI_ResendVerificationEmail', { defaultValue: defaultLocale.UI_ResendVerificationEmail })} placement="bottom">
                        <span className="cursor-pointer p-2 hover:text-red-500" onClick={onDialogOpen}>
                            <HiOutlineMail />
                        </span>
                    </Tooltip>
                    :
                    <Button block icon={<HiOutlineMail />} onClick={onDialogOpen}>
                        {t('UI_ResendVerificationEmail', { defaultValue: defaultLocale.UI_ResendVerificationEmail })}
                    </Button>
                }
                <ConfirmDialog
                    isOpen={dialogOpen}
                    type="danger"
                    title={t('UI_ResendVerificationEmail', { defaultValue: defaultLocale.UI_ResendVerificationEmail }) + `: ${name}`}
                    confirmButtonColor="red-600"
                    onClose={onDialogClose}
                    onRequestClose={onDialogClose}
                    onCancel={onDialogClose}
                    onConfirm={onResendVerificationEmail}
                    confirmText={t('UI_ResendVerificationEmail', { defaultValue: defaultLocale.UI_ResendVerificationEmail })}
                    cancelText={t('UI_Cancel', { defaultValue: defaultLocale.UI_Cancel })}
                >
                    <p>
                        {t('UI_ResendVerificationEmailConfirmation', { defaultValue: defaultLocale.UI_ResendVerificationEmailConfirmation })}
                    </p>
                </ConfirmDialog>
            </>}
        </>
    );
};

export default ResendVerificationEmailButton;