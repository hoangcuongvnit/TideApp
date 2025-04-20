import { useEffect, useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import { apiResetPassword } from '@/services/AuthService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useNavigate } from 'react-router-dom'
import { Field, Form, Formik } from 'formik'
import { jwtDecode } from 'jwt-decode'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import useQuery from '@/utils/hooks/useQuery'
import { RESET_TOKEN_KEY } from '@/constants/app.constant'
import { isEmpty } from 'lodash'
import useMessageErrors from '@/utils/hooks/useMessageErrors'
import { useTranslation } from 'react-i18next'
import { defaultLocale } from '@/locales/locales'

interface ResetPasswordFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type ResetPasswordFormSchema = {
    password: string
    confirmPassword: string
}

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const [resetComplete, setResetComplete] = useState(false)

    const [message, setMessage] = useTimeOutMessage(0)

    const navigate = useNavigate()

    const query = useQuery()

    const { t } = useTranslation()

    const validationSchema = Yup.object().shape({
        password: Yup.string().required(t('UI_Password_Required', { defaultValue: defaultLocale.UI_Password_Required }))
            .min(8, t('UI_Password_MinimumLength', { defaultValue: defaultLocale.UI_Password_MinimumLength }))
            .matches(/(?=.*[a-z])/, t('UI_Password_Lowercase', { defaultValue: defaultLocale.UI_Password_Lowercase }))
            .matches(/(?=.*[A-Z])/, t('UI_Password_Uppercase', { defaultValue: defaultLocale.UI_Password_Uppercase }))
            .matches(/(?=.*\d)/, t('UI_Password_Digit', { defaultValue: defaultLocale.UI_Password_Digit }))
            .matches(/(?=.*\W)/, t('UI_Password_SpecialCharacter', { defaultValue: defaultLocale.UI_Password_SpecialCharacter })),
        confirmPassword: Yup.string().oneOf(
            [Yup.ref('password')],
            t('UI_PasswordsDoNotMatch', { defaultValue: defaultLocale.UI_PasswordsDoNotMatch })
        ),
    })

    useEffect(() => {
        const token = query.get(RESET_TOKEN_KEY) || ''
        if (isEmpty(token)) {
            navigate('/forgot-password')
        }
    }, [])

    const onSubmit = async (
        values: ResetPasswordFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
        setErrors: (errors: any) => void
    ) => {
        const { password } = values
        setSubmitting(true)
        setMessage('')
        
        try {
            const token = query.get(RESET_TOKEN_KEY) || ''
            if (!isEmpty(token)) {
                const { userId: id } = jwtDecode(token) as { userId: string }

                if (!!id && !isEmpty(id)) {
                    await apiResetPassword(id, { token, password })
                }
                else {
                    setMessage(t('UI_InvalidToken', { defaultValue: defaultLocale.UI_InvalidToken }))
                }
            }
            
            setSubmitting(false)
            setResetComplete(true)
        } catch (errors: any) {
            useMessageErrors(errors, setErrors, setMessage)
            setSubmitting(false)
        }
    }

    const onContinue = () => {
        navigate('/sign-in')
    }

    return (
        <div className={className}>
            <div className="mb-6">
                {resetComplete ? (
                    <>
                        <h3 className="mb-1">{t('UI_ResetDone', { defaultValue: defaultLocale.UI_ResetDone })}</h3>
                        <p>{t('UI_PasswordResetSuccess', { defaultValue: defaultLocale.UI_PasswordResetSuccess })}</p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1">{t('UI_SetNewPassword', { defaultValue: defaultLocale.UI_SetNewPassword })}</h3>
                        <p>{t('UI_NewPasswordMustBeDifferent', { defaultValue: defaultLocale.UI_NewPasswordMustBeDifferent })}</p>
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
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, setErrors }) => {
                    if (!disableSubmit) {
                        onSubmit(values, setSubmitting, setErrors)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            {!resetComplete ? (
                                <>
                                    <FormItem
                                        label={t('UI_Password', { defaultValue: defaultLocale.UI_Password })}
                                        invalid={
                                            errors.password && touched.password
                                        }
                                        errorMessage={errors.password}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="password"
                                            placeholder={t('UI_Password', { defaultValue: defaultLocale.UI_Password })}
                                            component={PasswordInput}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label={t('UI_ConfirmPassword', { defaultValue: defaultLocale.UI_ConfirmPassword })}
                                        invalid={
                                            errors.confirmPassword &&
                                            touched.confirmPassword
                                        }
                                        errorMessage={errors.confirmPassword}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="confirmPassword"
                                            placeholder={t('UI_ConfirmPassword', { defaultValue: defaultLocale.UI_ConfirmPassword })}
                                            component={PasswordInput}
                                        />
                                    </FormItem>
                                    <Button
                                        block
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? t('UI_Submitting', { defaultValue: defaultLocale.UI_Submitting })
                                            : t('UI_Submit', { defaultValue: defaultLocale.UI_Submit })}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    block
                                    variant="solid"
                                    type="button"
                                    onClick={onContinue}
                                >
                                    {t('UI_Continue', { defaultValue: defaultLocale.UI_Continue })}
                                </Button>
                            )}

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

export default ResetPasswordForm