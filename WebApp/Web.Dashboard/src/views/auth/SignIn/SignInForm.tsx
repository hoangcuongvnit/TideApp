import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useAuth from '@/utils/hooks/useAuth'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import { ApiStatus } from '@/configs/app.config'
import { useTranslation } from 'react-i18next'
import { defaultLocale } from '@/locales'
import useMessageErrors from '@/utils/hooks/useMessageErrors'
import LanguageSelector from '@/components/template/LanguageSelector'
import ModeSwitcherUi from '@/components/template/ThemeConfigurator/ModeSwitcherUi'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    forgotPasswordUrl?: string
    signUpUrl?: string
}

type SignInFormSchema = {
    email: string
    password: string
    rememberMe: boolean
}

const SignInForm = (props: SignInFormProps) => {
    const {
        disableSubmit = false,
        className,
        forgotPasswordUrl = '/forgot-password',
        signUpUrl = '/sign-up',
    } = props

    const [message, setMessage] = useTimeOutMessage()
    const { t } = useTranslation()

    const validationSchema = Yup.object().shape({
        email: Yup.string().required(t('UI_Email_Required', defaultLocale.UI_Email_Required))
            .email(t('UI_Email_Invalid', defaultLocale.UI_Email_Invalid)),
        password: Yup.string().required(t('UI_Password_Required', defaultLocale.UI_Password_Required)),
        rememberMe: Yup.bool(),
    })

    const { signIn } = useAuth()

    const onSignIn = async (
        values: SignInFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
        setErrors: (errors: any) => void
    ) => {
        const { email, password } = values
        setSubmitting(true)

        const result = await signIn({ email, password })

        if (result?.status === ApiStatus.failed && result.errors) {
            useMessageErrors(result.errors, setErrors, setMessage)
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className='mb-4' type='danger'>
                    <div dangerouslySetInnerHTML={{ __html: message }}></div>
                </Alert>
            )}
            <Formik
                initialValues={{
                    email: 'hoangcuongvnit@gmail.com',
                    password: 'AghtRe#2#3',
                    rememberMe: true,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, setErrors }) => {
                    if (!disableSubmit) {
                        onSignIn(values, setSubmitting, setErrors)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label={t('UI_Email', defaultLocale.UI_Email)}
                                invalid={
                                    (errors.email &&
                                        touched.email) as boolean
                                }
                                errorMessage={errors.email}
                            >
                                <Field
                                    type='email'
                                    autoComplete='off'
                                    name='email'
                                    placeholder={t('UI_Email', defaultLocale.UI_Email)}
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label={t('UI_Password', defaultLocale.UI_Password)}
                                invalid={
                                    (errors.password &&
                                        touched.password) as boolean
                                }
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete='off'
                                    name='password'
                                    placeholder={t('UI_Password', defaultLocale.UI_Password)}
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <div className='flex justify-between mb-6'>
                                <Field
                                    className='mb-0'
                                    name='rememberMe'
                                    component={Checkbox}
                                >
                                    {t('UI_RememberMe', defaultLocale.UI_RememberMe)}
                                </Field>
                                <ActionLink to={forgotPasswordUrl}>
                                    {t('UI_ForgotPassword', defaultLocale.UI_ForgotPassword)}
                                </ActionLink>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant='solid'
                                type='submit'
                            >
                                {isSubmitting ? t('UI_SigningIn', defaultLocale.UI_SigningIn) :
                                    t('UI_SignIn', defaultLocale.UI_SignIn)}
                            </Button>
                            <div className='mt-4 mb-4 text-center'>
                                <span>{t('UI_DoNotHaveAnAccount', defaultLocale.UI_DoNotHaveAnAccount)} </span>
                                <ActionLink to={signUpUrl}>{t('UI_SignUp', defaultLocale.UI_SignUp)}</ActionLink>
                            </div>
                            <div className='flex justify-center'>
                                <ModeSwitcherUi />
                                <LanguageSelector />
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignInForm