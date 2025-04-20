import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import { apiPutAccountProfile } from '@/services/AccountServices'
import {
    HiOutlineUserCircle,
    HiOutlineMail,
    HiOutlineBriefcase,
    HiOutlineUser,
    HiOutlinePhone,
} from 'react-icons/hi'
import * as Yup from 'yup'
import type { FormikProps, FieldInputProps, FieldProps } from 'formik'
import type {
    ProfileModel,
    ProfileUpdateModel
} from '@/@types/account'
import useMessageErrors from '@/utils/hooks/useMessageErrors'
import { useTranslation } from 'react-i18next'
import { defaultLocale } from '@/locales/locales'

type ProfileProps = {
    data?: ProfileModel
    updateProfileFn?: Function
}

const Profile = ({
    data = {
        id: '',
        displayName: '',
        email: '',
        avatar: '',
        phoneNumber: '',
        address: '',
    },
    updateProfileFn = () => {}
}: ProfileProps) => {
    const { t } = useTranslation()
    
    const validationSchema = Yup.object().shape({
        displayName: Yup.string()
            .min(1, t('UI_Too_Short', { defaultValue: defaultLocale.UI_Too_Short }))
            .max(20, t('UI_Too_Long', { defaultValue: defaultLocale.UI_Too_Long }))
            .required(t('UI_User_Name_Required', { defaultValue: defaultLocale.UI_User_Name_Required })),
        address: Yup.string(),
        phoneNumber: Yup.string()
        .matches(
            /^(\d{10}|\+\d{1,3}\s?\d{1,9})$/,
            t('UI_Phone_Number_Must_Be_Exactly', { defaultValue: defaultLocale.UI_Phone_Number_Must_Be_Exactly })
        )
        .required(t('UI_Please_Enter_Your_Phone_Number', { defaultValue: defaultLocale.UI_Please_Enter_Your_Phone_Number })),
    })

    const onSetFormFile = (
        form: FormikProps<ProfileModel>,
        field: FieldInputProps<ProfileModel>,
        file: File[]
    ) => {
        form.setFieldValue(field.name, URL.createObjectURL(file[0]))
    }

    const onFormSubmit = async (
        values: ProfileModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const datas: ProfileUpdateModel = {
            id: values.id,
            email: values.email,
            displayName: values.displayName,
            address: values.address,
            phoneNumber: values.phoneNumber
        }

        try {
            await apiPutAccountProfile(datas)
            updateProfileFn(datas)
            toast.push(<Notification title={t('UI_Profile_Updated', { defaultValue: defaultLocale.UI_Profile_Updated })} type="success" />, {
                placement: 'top-center',
            })
        }
        catch (errors: any) {
            const errorMessage = useMessageErrors(errors)
            toast.push(<Notification title={t('UI_Profile_Update_Failed', { defaultValue: defaultLocale.UI_Profile_Update_Failed })} type="danger" duration={10000}>{errorMessage}</Notification>, {
                placement: 'top-center',
            })
        }
        setSubmitting(false)
    }

    return (
        <Formik
            enableReinitialize
            initialValues={data}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true)
                setTimeout(() => {
                    onFormSubmit(values, setSubmitting)
                }, 1000)
            }}
        >
            {({ touched, errors, isSubmitting, resetForm }) => {
                const validatorProps = { touched, errors }
                return (
                    <Form>
                        <FormContainer>
                            <FormDesription
                                title={t('UI_General', { defaultValue: defaultLocale.UI_General })}
                                desc={t('UI_Basic_Info_Description', { defaultValue: defaultLocale.UI_Basic_Info_Description })}
                            />
                            <FormRow
                                name="displayName"
                                label={t('UI_Name', { defaultValue: defaultLocale.UI_Name })}
                                {...validatorProps}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="displayName"
                                    placeholder={t('UI_Name', { defaultValue: defaultLocale.UI_Name })}
                                    component={Input}
                                    prefix={
                                        <HiOutlineUserCircle className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="email"
                                label={t('UI_Email', { defaultValue: defaultLocale.UI_Email })}
                                {...validatorProps}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder={t('UI_Email', { defaultValue: defaultLocale.UI_Email })}
                                    component={Input}
                                    disabled={true}
                                    prefix={
                                        <HiOutlineMail className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="address"
                                label={t('UI_Address', { defaultValue: defaultLocale.UI_Address })}
                                {...validatorProps}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="address"
                                    placeholder={t('UI_Address', { defaultValue: defaultLocale.UI_Address })}
                                    component={Input}
                                    prefix={
                                        <HiOutlineBriefcase className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="phoneNumber"
                                label={t('UI_Phone_Number', { defaultValue: defaultLocale.UI_Phone_Number })}
                                {...validatorProps}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="phoneNumber"
                                    placeholder={t('UI_Phone_Number', { defaultValue: defaultLocale.UI_Phone_Number })}
                                    component={Input}
                                    prefix={
                                        <HiOutlinePhone  className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="avatar"
                                label={t('UI_Avatar', { defaultValue: defaultLocale.UI_Avatar })}
                                {...validatorProps}
                            >
                                <Field name="avatar">
                                    {({ field, form }: FieldProps) => {
                                        const avatarProps = field.value
                                            ? { src: field.value }
                                            : {}
                                        return (
                                            <Upload
                                                className="cursor-pointer"
                                                showList={false}
                                                uploadLimit={1}
                                                onChange={(files) =>
                                                    onSetFormFile(
                                                        form,
                                                        field,
                                                        files
                                                    )
                                                }
                                                onFileRemove={(files) =>
                                                    onSetFormFile(
                                                        form,
                                                        field,
                                                        files
                                                    )
                                                }
                                            >
                                                <Avatar
                                                    className="border-2 border-white dark:border-gray-800 shadow-lg"
                                                    size={60}
                                                    shape="circle"
                                                    icon={<HiOutlineUser />}
                                                    {...avatarProps}
                                                />
                                            </Upload>
                                        )
                                    }}
                                </Field>
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
                                    {isSubmitting ? t('UI_Updating', { defaultValue: defaultLocale.UI_Updating }) : t('UI_Update', { defaultValue: defaultLocale.UI_Update })}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default Profile