import { forwardRef } from 'react';
import { FormContainer } from '@/components/ui/Form';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import PersonalInfoForm, { FormFieldsName } from './PersonalInfoForm';
import type { Role, User } from '../../store';
import { useTranslation } from 'react-i18next';
import { defaultLocale } from '@/locales';
import { PasswordStrengthDefault } from './UserEditConstant';

type UserModel = FormFieldsName;

export interface FormModel extends UserModel {}

export type FormikRef = FormikProps<FormModel>;

export type UserProps = Partial<User>;

type UserEditFromProps = {
    user: UserProps;
    roles: Role[];
    onFormSubmit: (values: FormModel, setErrors: (errors: any) => void) => void;
};

const UserEditFrom = forwardRef<FormikRef, UserEditFromProps>((props, ref) => {
    const { user, roles, onFormSubmit } = props;
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        displayName: Yup.string()
            .min(3, t('UI_UserNameTooShort', { defaultValue: defaultLocale.UI_UserNameTooShort }))
            .max(20, t('UI_UserNameTooLong', { defaultValue: defaultLocale.UI_UserNameTooLong }))
            .required(t('UI_UserNameRequired', { defaultValue: defaultLocale.UI_UserNameRequired })),
        address: Yup.string(),
        phoneNumber: Yup.string()
            .matches(
                /^(\d{10}|\+\d{1,3}\s?\d{1,9})$/,
                t('UI_PhoneNumberInvalid', { defaultValue: defaultLocale.UI_PhoneNumberInvalid })
            ),
        img: Yup.string(),
        password: Yup.string()
            .required(t('UI_Password_Required', { defaultValue: defaultLocale.UI_Password_Required }))
            .min(8, t('UI_Password_MinimumLength', { defaultValue: defaultLocale.UI_Password_MinimumLength }))
            .matches(/(?=.*[a-z])/, t('UI_Password_Lowercase', { defaultValue: defaultLocale.UI_Password_Lowercase }))
            .matches(/(?=.*[A-Z])/, t('UI_Password_Uppercase', { defaultValue: defaultLocale.UI_Password_Uppercase }))
            .matches(/(?=.*\d)/, t('UI_Password_Digit', { defaultValue: defaultLocale.UI_Password_Digit }))
            .matches(/(?=.*\W)/, t('UI_Password_SpecialCharacter', { defaultValue: defaultLocale.UI_Password_SpecialCharacter }))
    });

    return (
        <Formik<FormModel>
            innerRef={ref}
            initialValues={{
                displayName: user.displayName || '',
                email: user.email || '',
                upload: user.avatar || '',
                address: user?.address || '',
                phoneNumber: user?.phoneNumber || '',
                role: user?.roleIds ? user.roleIds[0] : '',
                password: PasswordStrengthDefault
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, setErrors }) => {
                onFormSubmit?.(values, setErrors);
                setSubmitting(false);
            }}
        >
            {({ values, touched, errors }) => (
                <Form>
                    <div className='px-6'>
                        <FormContainer>
                            <PersonalInfoForm
                                values={values}
                                roles={roles}
                                touched={touched}
                                errors={errors}
                            />
                        </FormContainer>
                    </div>
                </Form>
            )}
        </Formik>
    );
});

UserEditFrom.displayName = 'UserEditFrom';

export default UserEditFrom;