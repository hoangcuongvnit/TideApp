import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import Select from '@/components/ui/Select'
import {
    HiUserCircle,
    HiMail,
    HiLocationMarker,
    HiPhone,
    HiOutlineUser,
    HiOutlineUsers,
} from 'react-icons/hi'
import { Field, FieldProps, FormikErrors, FormikState, FormikTouched } from 'formik'
import FormRow from '@/views/account/components/FormRow'
import { map } from 'lodash'
import PasswordInput from '@/components/shared/PasswordInput'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { Role } from '../../store'
import { useTranslation } from 'react-i18next'
import { defaultLocale } from '@/locales/locales'

type FormFieldsName = {
    img: string
    displayName: string
    email: string
    address: string
    phoneNumber: string
    roleId: string
    password: string
}

type PersonalInfoFormProps = {
    roles: Role[]
    values: FormFieldsName
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    message: string
    resetForm: (nextState?: Partial<FormikState<FormFieldsName>>) => void
}

type Option = {
    value: string
    label: string
}

const PersonalInfoForm = (props: PersonalInfoFormProps) => {
    const { t } = useTranslation()
    const { roles, values, touched, errors, message, resetForm } = props
    const validatorProps = { touched, errors }
    const roleOptions: Option[] = map(roles, (role) => ({ value: role.id, label: t(`UI_${role.localeKey}`, role.name) }))

    return (
        <>
            <FormRow
                name="img"
                label=""
                {...validatorProps}
            >
                <Field name="img">
                    {({ field, form }: FieldProps) => {
                        const avatarProps = field.value
                            ? { src: field.value }
                            : {}
                        return (
                            <div className="flex justify-center">
                                <Upload
                                    className="cursor-pointer"
                                    showList={false}
                                    uploadLimit={1}
                                    onChange={(files) =>
                                        form.setFieldValue(
                                            field.name,
                                            URL.createObjectURL(files[0])
                                        )
                                    }
                                    onFileRemove={(files) =>
                                        form.setFieldValue(
                                            field.name,
                                            URL.createObjectURL(files[0])
                                        )
                                    }
                                >
                                    <Avatar
                                        className="border-2 border-white dark:border-gray-800 shadow-lg"
                                        size={100}
                                        shape="circle"
                                        icon={<HiOutlineUser />}
                                        {...avatarProps}
                                    />
                                </Upload>
                            </div>
                        )
                    }}
                </Field>
            </FormRow>
            <FormRow
                name="displayName"
                label={t('UI_DisplayName', { defaultValue: defaultLocale.UI_DisplayName })}
                {...validatorProps}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="displayName"
                    placeholder={t('UI_DisplayName', { defaultValue: defaultLocale.UI_DisplayName })}
                    component={Input}
                    prefix={<HiUserCircle className="text-xl" />}
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
                    prefix={<HiMail className="text-xl" />}
                />
            </FormRow>
            <FormRow
                name="phoneNumber"
                label={t('UI_PhoneNumber', { defaultValue: defaultLocale.UI_PhoneNumber })}
                {...validatorProps}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="phoneNumber"
                    placeholder={t('UI_PhoneNumber', { defaultValue: defaultLocale.UI_PhoneNumber })}
                    component={Input}
                    prefix={<HiPhone className="text-xl" />}
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
                    prefix={<HiLocationMarker className="text-xl" />}
                />
            </FormRow>
            <FormRow
                name="password"
                label={t('UI_Password', { defaultValue: defaultLocale.UI_Password })}
                {...validatorProps}
            >
                <Field
                    type="password"
                    autoComplete="off"
                    name="password"
                    placeholder={t('UI_Password', { defaultValue: defaultLocale.UI_Password })}
                    component={PasswordInput}
                />
            </FormRow>
            <FormRow
                name="roleId"
                label={t('UI_Roles', { defaultValue: defaultLocale.UI_Roles })}
                {...validatorProps}
            >
                <Field
                    name="roleId"
                    prefix={<HiOutlineUsers className="text-xl" />}>
                    {({
                        field,
                        form,
                    }: FieldProps<FormFieldsName>) => (
                        <Select
                            field={field}
                            form={form}
                            options={roleOptions}
                            value={roleOptions.filter(
                                (option) =>
                                    option.value ===
                                    values.roleId
                            )}
                            onChange={(option) =>
                                form.setFieldValue(
                                    field.name,
                                    option?.value
                                )
                            }
                        />
                    )}
                </Field>
            </FormRow>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <>{message}</>
                </Alert>
            )}
            <div className='grid md:grid-cols-3 gap-4 py-8'>
                <div className="col-start-2 col-span-2 mt-4 ltr:text-left">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        type="button"
                        onClick={() => resetForm()}
                    >
                        {t('UI_Reset', { defaultValue: defaultLocale.UI_Reset })}
                    </Button>
                    <Button
                        variant="solid"
                        type="submit"
                    >
                        {t('UI_Create', { defaultValue: defaultLocale.UI_Create })}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default PersonalInfoForm