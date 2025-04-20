import { forwardRef } from 'react'
import { FormContainer } from '@/components/ui/Form'
import { Form, Formik, FormikProps } from 'formik'
import * as Yup from 'yup'
import PersonalInfoForm from './PersonalInfoForm'
import { UserCreateFormModel } from './UserCreateModel'
import FormDesription from './FormDesription'
import { Role, WebApplication } from '../../store'
import { defaultLocale } from '@/locales'
import { useTranslation } from 'react-i18next'

export type FormikRef = FormikProps<UserCreateFormModel>

type UserCreateFormProps = {
    user: UserCreateFormModel,
    roles: Role[]
    webApplications: WebApplication[]
    message: string
    onFormSubmit: (values: UserCreateFormModel, setErrors: (errors: any) => void) => void
}

const UserCreateForm = forwardRef<FormikRef, UserCreateFormProps>((props, ref) => {
    const { user, roles, webApplications, message, onFormSubmit } = props
    const { t } = useTranslation()

    const validationSchema = Yup.object().shape({
        displayName: Yup.string().required(t('UI_PleaseEnterYourName', defaultLocale.UI_PleaseEnterYourName)),
        email: Yup.string().required(t('UI_Email_Required', defaultLocale.UI_Email_Required))
            .email(t('UI_Email_Invalid', defaultLocale.UI_Email_Invalid)),
        roleId: Yup.string().required(t('UI_Role_Required', defaultLocale.UI_Role_Required)),
        password: Yup.string().required(t('UI_Password_Required', defaultLocale.UI_Password_Required))
            .min(8, t('UI_Password_MinimumLength', defaultLocale.UI_Password_MinimumLength))
            .matches(/(?=.*[a-z])/, t('UI_Password_Lowercase', defaultLocale.UI_Password_Lowercase))
            .matches(/(?=.*[A-Z])/, t('UI_Password_Uppercase', defaultLocale.UI_Password_Uppercase))
            .matches(/(?=.*\d)/, t('UI_Password_Digit', defaultLocale.UI_Password_Digit))
            .matches(/(?=.*\W)/, t('UI_Password_SpecialCharacter', defaultLocale.UI_Password_SpecialCharacter))
    })

    return (
        <Formik<UserCreateFormModel>
            innerRef={ref}
            initialValues={{
                displayName: user.displayName || '',
                email: user.email || '',
                img: user.img || '',
                address: user?.address || '',
                phoneNumber: user?.phoneNumber || '',
                roleId: user?.roleId || '',
                webApplication: user?.webApplication || '',
                password: user?.password || ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, setErrors }) => {
                onFormSubmit?.(values, setErrors)
                setSubmitting(false)
            }}
        >
            {({ values, touched, errors, resetForm }) => (
                <Form>
                    <FormContainer>
                        <FormDesription
                            title={t('UI_CreateUser', defaultLocale.UI_CreateUser)}
                            desc={t('UI_BasicInfoDescription', defaultLocale.UI_BasicInfoDescription)}
                        />
                        <PersonalInfoForm
                            values={values}
                            roles={roles}
                            webApplications={webApplications}
                            touched={touched}
                            errors={errors}
                            resetForm={resetForm}
                            message={message}
                        />
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
})

UserCreateForm.displayName = 'UserCreateForm'

export default UserCreateForm
