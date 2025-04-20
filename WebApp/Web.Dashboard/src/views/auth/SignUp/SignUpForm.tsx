import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'
import { defaultLocale } from '@/locales/locales'
import { useTranslation } from 'react-i18next'
import { ApiStatus } from '@/configs/app.config'
import useMessageErrors from '@/utils/hooks/useMessageErrors'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type SignUpFormSchema = {
    displayName: string
    phoneNumber: string
    address: string
    password: string
    email: string
}

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const { signUp } = useAuth()
    const [message, setMessage] = useTimeOutMessage()
    const { t } = useTranslation()

    const validationSchema = Yup.object().shape({
        displayName: Yup.string().required(t('UI_PleaseEnterYourName', defaultLocale.UI_PleaseEnterYourName)),
        phoneNumber: Yup.string()
            .matches(
                /^(\d{10}|\+\d{1,3}\s?\d{1,9})$/,
                t('UI_PhoneNumberMustBeExactly', defaultLocale.UI_PhoneNumberMustBeExactly)
            )
            .required(t('UI_PleaseEnterYourPhoneNumber', defaultLocale.UI_PleaseEnterYourPhoneNumber)),
        address: Yup.string().required(t('UI_PleaseEnterYourAddress', defaultLocale.UI_PleaseEnterYourAddress)),
        email: Yup.string().required(t('UI_Email_Required', defaultLocale.UI_Email_Required))
            .email(t('UI_Email_Invalid', defaultLocale.UI_Email_Invalid)),
        password: Yup.string().required(t('UI_Password_Required', defaultLocale.UI_Password_Required))
            .min(8, t('UI_Password_MinimumLength', defaultLocale.UI_Password_MinimumLength))
            .matches(/(?=.*[a-z])/, t('UI_Password_Lowercase', defaultLocale.UI_Password_Lowercase))
            .matches(/(?=.*[A-Z])/, t('UI_Password_Uppercase', defaultLocale.UI_Password_Uppercase))
            .matches(/(?=.*\d)/, t('UI_Password_Digit', defaultLocale.UI_Password_Digit))
            .matches(/(?=.*\W)/, t('UI_Password_SpecialCharacter', defaultLocale.UI_Password_SpecialCharacter)),
        confirmPassword: Yup.string().oneOf(
            [Yup.ref('password')],
            t('UI_PasswordsDoNotMatch', defaultLocale.UI_PasswordsDoNotMatch)
        ),
    })

    const onSignUp = async (
        values: SignUpFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
        setErrors: (errors: any) => void
    ) => {
        const { email, password, displayName, address, phoneNumber } = values
        setSubmitting(true)
        const result = await signUp({ email, password, displayName, phoneNumber, address })

        if (result?.status === ApiStatus.failed && result.errors) {
            useMessageErrors(result.errors, setErrors, setMessage)
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            <Formik
                initialValues={{
                    displayName: 'Cuong Hoang',
                    phoneNumber: '0123456789',
                    password: 'AghtRe#2#3',
                    confirmPassword: 'AghtRe#2#3',
                    email: 'hoangneo20@gmail.com',
                    address: 'abc df',
                    birthDate: '2001-01-01',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, setErrors }) => {
                    if (!disableSubmit) {
                        onSignUp(values, setSubmitting, setErrors)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label={t('UI_FullName', defaultLocale.UI_FullName)}
                                invalid={errors.displayName && touched.displayName}
                                errorMessage={errors.displayName}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="displayName"
                                    placeholder={t('UI_FullName', defaultLocale.UI_FullName)}
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label={t('UI_PhoneNumber', defaultLocale.UI_PhoneNumber)}
                                invalid={errors.phoneNumber && touched.phoneNumber}
                                errorMessage={errors.phoneNumber}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="phoneNumber"
                                    placeholder={t('UI_PhoneNumber', defaultLocale.UI_PhoneNumber)}
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label={t('UI_Address', defaultLocale.UI_Address)}
                                invalid={errors.address && touched.address}
                                errorMessage={errors.address}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="address"
                                    placeholder={t('UI_Address', defaultLocale.UI_Address)}
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label={t('UI_Email', defaultLocale.UI_Email)}
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder={t('UI_Email', defaultLocale.UI_Email)}
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label={t('UI_Password', defaultLocale.UI_Password)}
                                invalid={errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder={t('UI_Password', defaultLocale.UI_Password)}
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <FormItem
                                label={t('UI_ConfirmPassword', defaultLocale.UI_ConfirmPassword)}
                                invalid={errors.confirmPassword && touched.confirmPassword}
                                errorMessage={errors.confirmPassword}
                            >
                                <Field
                                    autoComplete="off"
                                    name="confirmPassword"
                                    placeholder={t('UI_ConfirmPassword', defaultLocale.UI_ConfirmPassword)}
                                    component={PasswordInput}
                                />
                            </FormItem>
                            {message && (
                                <Alert showIcon className="my-4" type="danger">
                                    {message}
                                </Alert>
                            )}
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting
                                    ? t('UI_CreatingAccount', defaultLocale.UI_CreatingAccount)
                                    : t('UI_SignUp', defaultLocale.UI_SignUp)}
                            </Button>
                            <div className="mt-4 text-center mb-9">
                                <span>{t('UI_AlreadyHaveAnAccount', defaultLocale.UI_AlreadyHaveAnAccount)} </span>
                                <ActionLink to={signInUrl}>{t('UI_SignIn', defaultLocale.UI_SignIn)}</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignUpForm