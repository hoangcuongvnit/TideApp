import classNames from 'classnames'
import PasswordInput from '@/components/shared/PasswordInput'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import isLastChild from '@/utils/isLastChild'
import { apiPutChangePassword } from '@/services/AccountServices'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import {
    HiOutlineDesktopComputer,
    HiOutlineDeviceMobile,
    HiOutlineDeviceTablet,
} from 'react-icons/hi'
import dayjs from 'dayjs'
import * as Yup from 'yup'
import type {
    PasswordUpdateModel
} from '@/@types/account'
import Alert from '@/components/ui/Alert'
import { useTranslation } from 'react-i18next'
import { defaultLocale } from '@/locales/locales'
import useMessageErrors from '@/utils/hooks/useMessageErrors'

type LoginHistory = {
    type: string
    deviceName: string
    time: number
    location: string
}

type PasswordFormModel = {
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
}

const LoginHistoryIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'Desktop':
            return <HiOutlineDesktopComputer />
        case 'Mobile':
            return <HiOutlineDeviceMobile />
        case 'Tablet':
            return <HiOutlineDeviceTablet />
        default:
            return <HiOutlineDesktopComputer />
    }
}

const Password = ({ data }: { data?: LoginHistory[] }) => {
    const [message, setMessage] = useTimeOutMessage()
    const { t } = useTranslation()

    const validationSchema = Yup.object().shape({
        currentPassword: Yup.string().required(t('UI_Password_Required', { defaultValue: defaultLocale.UI_Password_Required })),
        newPassword: Yup.string().required(t('UI_Password_Required', { defaultValue: defaultLocale.UI_Password_Required }))
            .min(8, t('UI_Password_MinimumLength', { defaultValue: defaultLocale.UI_Password_MinimumLength }))
            .matches(/(?=.*[a-z])/, t('UI_Password_Lowercase', { defaultValue: defaultLocale.UI_Password_Lowercase }))
            .matches(/(?=.*[A-Z])/, t('UI_Password_Uppercase', { defaultValue: defaultLocale.UI_Password_Uppercase }))
            .matches(/(?=.*\d)/, t('UI_Password_Digit', { defaultValue: defaultLocale.UI_Password_Digit }))
            .matches(/(?=.*\W)/, t('UI_Password_SpecialCharacter', { defaultValue: defaultLocale.UI_Password_SpecialCharacter }))
            .notOneOf([Yup.ref('currentPassword')], t('UI_NewPasswordMustBeDifferent', { defaultValue: defaultLocale.UI_NewPasswordMustBeDifferent })),
        confirmNewPassword: Yup.string().oneOf(
            [Yup.ref('newPassword')],
            t('UI_PasswordsDoNotMatch', { defaultValue: defaultLocale.UI_PasswordsDoNotMatch }))
    })

    const onFormSubmit = async (
        values: PasswordFormModel,
        setSubmitting: (isSubmitting: boolean) => void,
        setErrors: (errors: any) => void
    ) => {
        const datas: PasswordUpdateModel = {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword
        }

        try {
            setSubmitting(true)
            await apiPutChangePassword(datas)

            toast.push(<Notification title={t('UI_Password_Updated', { defaultValue: defaultLocale.UI_Password_Updated })} type="success" />, {
                placement: 'top-center',
            })
        } catch (errors: any) {
            useMessageErrors(errors, setErrors, setMessage)
        }

        setSubmitting(false)
    }

    return (
        <>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <>{message}</>
                </Alert>
            )}
            <Formik
                initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => await onFormSubmit(values, setSubmitting, setErrors)}
            >
                {({ touched, errors, isSubmitting, resetForm }) => {
                    const validatorProps = { touched, errors }
                    return (
                        <Form>
                            <FormContainer>
                                <FormDesription
                                    title={t('UI_Password_Title', { defaultValue: defaultLocale.UI_Password_Title })}
                                    desc={t('UI_Password_Description', { defaultValue: defaultLocale.UI_Password_Description })}
                                />
                                <FormRow
                                    name="currentPassword"
                                    label={t('UI_Current_Password', { defaultValue: defaultLocale.UI_Current_Password })}
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="currentPassword"
                                        placeholder={t('UI_Current_Password', { defaultValue: defaultLocale.UI_Current_Password })}
                                        component={PasswordInput}
                                    />
                                </FormRow>
                                <FormRow
                                    name="newPassword"
                                    label={t('UI_New_Password', { defaultValue: defaultLocale.UI_New_Password })}
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="newPassword"
                                        placeholder={t('UI_New_Password', { defaultValue: defaultLocale.UI_New_Password })}
                                        component={PasswordInput}
                                    />
                                </FormRow>
                                <FormRow
                                    name="confirmNewPassword"
                                    label={t('UI_Confirm_Password', { defaultValue: defaultLocale.UI_Confirm_Password })}
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="confirmNewPassword"
                                        placeholder={t('UI_Confirm_Password', { defaultValue: defaultLocale.UI_Confirm_Password })}
                                        component={PasswordInput}
                                    />
                                </FormRow>
                                <div className="mt-4 ltr:text-right">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        type="button"
                                        onClick={() => resetForm()}
                                    >
                                        {t('UI_Reset', { defaultValue: defaultLocale.UI_Reset })}
                                    </Button>
                                    <Button
                                        variant="solid"
                                        loading={isSubmitting}
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? t('UI_Updating', { defaultValue: defaultLocale.UI_Updating })
                                            : t('UI_Update_Password', { defaultValue: defaultLocale.UI_Update_Password })}
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
            <div className="mt-6">
                <FormDesription
                    title={t('UI_Signed_In_Devices_Title', { defaultValue: defaultLocale.UI_Signed_In_Devices_Title })}
                    desc={t('UI_Signed_In_Devices_Description', { defaultValue: defaultLocale.UI_Signed_In_Devices_Description })}
                />
                {data && (
                    <div className="rounded-lg border border-gray-200 dark:border-gray-600 mt-6">
                        {data.map((log, index) => (
                            <div
                                key={log.deviceName}
                                className={classNames(
                                    'flex items-center px-4 py-6',
                                    !isLastChild(data, index) &&
                                    'border-b border-gray-200 dark:border-gray-600'
                                )}
                            >
                                <div className="flex items-center">
                                    <div className="text-3xl">
                                        <LoginHistoryIcon type={log.type} />
                                    </div>
                                    <div className="ml-3 rtl:mr-3">
                                        <div className="flex items-center">
                                            <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                                {log.deviceName}
                                            </div>
                                            {index === 0 && (
                                                <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 rounded-md border-0 mx-2">
                                                    <span className="capitalize">
                                                        {t('UI_Current', { defaultValue: defaultLocale.UI_Current })}
                                                    </span>
                                                </Tag>
                                            )}
                                        </div>
                                        <span>
                                            {log.location} •{' '}
                                            {dayjs
                                                .unix(log.time)
                                                .format('DD-MMM-YYYY, hh:mm A')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default Password