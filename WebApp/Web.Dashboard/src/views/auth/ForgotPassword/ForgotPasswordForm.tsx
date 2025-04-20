import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import ActionLink from '@/components/shared/ActionLink'
import { apiForgotPassword } from '@/services/AuthService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import { useTranslation } from 'react-i18next'
import { defaultLocale } from '@/locales/locales'
import useMessageErrors from '@/utils/hooks/useMessageErrors'

interface ForgotPasswordFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type ForgotPasswordFormSchema = {
    email: string
}

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const [emailSent, setEmailSent] = useState(false)
    const [message, setMessage] = useTimeOutMessage()
    const { t } = useTranslation()

    const validationSchema = Yup.object().shape({
        email: Yup.string().required(t('UI_Email_Required', { defaultValue: defaultLocale.UI_Email_Required })),
    })

    const onSendMail = async (
        values: ForgotPasswordFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
        setErrors: (errors: any) => void
    ) => {
        setSubmitting(true)
        try {
            await apiForgotPassword(values)
            setSubmitting(false)
            setEmailSent(true)
        } catch (errors: any) {
            useMessageErrors(errors, setErrors, setMessage)
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <div className="mb-6">
                {emailSent ? (
                    <>
                        <h3 className="mb-1">{t('UI_CheckYourEmail', { defaultValue: defaultLocale.UI_CheckYourEmail })}</h3>
                        <p>{t('UI_RecoveryInstruction', { defaultValue: defaultLocale.UI_RecoveryInstruction })}</p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1">{t('UI_ForgotPassword', { defaultValue: defaultLocale.UI_ForgotPassword })}</h3>
                        <p>{t('UI_EnterEmailForVerification', { defaultValue: defaultLocale.UI_EnterEmailForVerification })}</p>
                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    email: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, setErrors }) => {
                    if (!disableSubmit) {
                        onSendMail(values, setSubmitting, setErrors)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className={emailSent ? 'hidden' : ''}>
                                <FormItem
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                                >
                                    <Field
                                        type="email"
                                        autoComplete="off"
                                        name="email"
                                        placeholder={t('UI_Email', { defaultValue: defaultLocale.UI_Email })}
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {emailSent ? t('UI_ResendEmail', { defaultValue: defaultLocale.UI_ResendEmail }) : t('UI_SendEmail', { defaultValue: defaultLocale.UI_SendEmail })}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>{t('UI_BackTo', { defaultValue: defaultLocale.UI_BackTo })} </span>
                                <ActionLink to={signInUrl}>{t('UI_SignIn', { defaultValue: defaultLocale.UI_SignIn })}</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ForgotPasswordForm