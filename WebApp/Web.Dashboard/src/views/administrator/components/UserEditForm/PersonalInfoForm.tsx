import React, { useState } from 'react'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import { FormItem } from '@/components/ui/Form'
import {
    HiUserCircle,
    HiMail,
    HiLocationMarker,
    HiPhone,
    HiOutlineUser,
    HiOutlineUsers,
} from 'react-icons/hi'
import { Field, FieldProps, FormikErrors, FormikTouched } from 'formik'
import { useTranslation } from 'react-i18next'
import { defaultLocale } from '@/locales/locales'
import Select from '@/components/ui/Select'
import { map, sortBy } from 'lodash'
import { Role } from '../../store/ManagerUserSlice'
import { Roles } from '@/constants/authority.constant'
import PasswordInput from '@/components/shared/PasswordInput'
import { PasswordStrengthDefault } from './UserEditConstant'

export type FormFieldsName = {
    upload: string
    displayName: string
    email: string
    address: string
    phoneNumber: string
    role: string
    password: string | null
}

type PersonalInfoFormProps = {
    roles: Role[]
    values: FormFieldsName
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
}

type Option = {
    value: string
    label: string
}

const PersonalInfoForm = (props: PersonalInfoFormProps) => {
    const { roles, values, touched, errors } = props
    const { t } = useTranslation()
    const [isPasswordEditEnabled, setIsPasswordEditEnabled] = useState(false)

    const options: Option[] = map(sortBy(roles, 'order'), (role) => {
        if (role.name === Roles.Administrator) {
            return null
        }
        return { value: role.id, label: t(`UI_${role.localeKey}`, role.name) } as Option
    }).filter(option => option !== null)

    const adminRoleId = roles.find((role) => role.name === Roles.Administrator)?.id

    const enablePasswordEdit = () => {
        setIsPasswordEditEnabled(!isPasswordEditEnabled)
    }

    return (
        <>
            <FormItem
                invalid={errors.upload && touched.upload}
                errorMessage={errors.upload}
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
            </FormItem>
            <FormItem
                label={t('UI_Name', { defaultValue: defaultLocale.UI_Name })}
                invalid={errors.displayName && touched.displayName}
                errorMessage={errors.displayName}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="displayName"
                    placeholder={t('UI_Name', { defaultValue: defaultLocale.UI_Name })}
                    component={Input}
                    prefix={<HiUserCircle className="text-xl" />}
                />
            </FormItem>
            <FormItem
                label={t('UI_Email', { defaultValue: defaultLocale.UI_Email })}
                invalid={errors.email && touched.email}
                errorMessage={errors.email}
            >
                <Field
                    type="email"
                    autoComplete="off"
                    name="email"
                    placeholder={t('UI_Email', { defaultValue: defaultLocale.UI_Email })}
                    component={Input}
                    disabled={true}
                    prefix={<HiMail className="text-xl" />}
                />
            </FormItem>
            <FormItem
                label={t('UI_PhoneNumber', { defaultValue: defaultLocale.UI_PhoneNumber })}
                invalid={errors.phoneNumber && touched.phoneNumber}
                errorMessage={errors.phoneNumber}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="phoneNumber"
                    placeholder={t('UI_PhoneNumber', { defaultValue: defaultLocale.UI_PhoneNumber })}
                    component={Input}
                    prefix={<HiPhone className="text-xl" />}
                />
            </FormItem>
            <FormItem
                label={t('UI_Address', { defaultValue: defaultLocale.UI_Address })}
                invalid={errors.address && touched.address}
                errorMessage={errors.address}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="address"
                    placeholder={t('UI_Address', { defaultValue: defaultLocale.UI_Address })}
                    component={Input}
                    prefix={<HiLocationMarker className="text-xl" />}
                />
            </FormItem>
            {values.role !== adminRoleId &&
                <FormItem
                    label={t('UI_Roles', { defaultValue: defaultLocale.UI_Roles })}
                    invalid={errors.role && touched.role}
                    errorMessage={errors.role}
                >
                    <Field
                        name="role"
                        autoComplete="off"
                        prefix={<HiOutlineUsers className="text-xl" />}>
                        {({
                            field,
                            form,
                        }: FieldProps<FormFieldsName>) => (
                            <Select
                                name='role'
                                field={field}
                                form={form}
                                options={options}
                                value={
                                    options.filter(
                                        (option) => option.value === form.values.role
                                    )
                                }
                                onChange={(option) =>
                                    form.setFieldValue(
                                        field.name,
                                        option?.value
                                    )
                                }
                                isDisabled={values.role === adminRoleId}
                            />
                        )}
                    </Field>
                </FormItem>}
            <FormItem>
                <Field type="checkbox">
                    {({
                        field,
                        form,
                    }: FieldProps) => (
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                onChange={(e) => {
                                    enablePasswordEdit()
                                    if (e.target.checked) {
                                        form.setFieldValue('password', '');
                                    }
                                    else {
                                        form.setFieldValue('password', PasswordStrengthDefault)
                                    }
                                }}
                            />
                            <span>{t('UI_EnablePasswordEdit', { defaultValue: defaultLocale.UI_EnablePasswordEdit })}</span>
                        </label>
                    )}
                </Field>
            </FormItem>
            {isPasswordEditEnabled && (
                <FormItem
                    label={t('UI_Password', { defaultValue: defaultLocale.UI_Password })}
                    invalid={errors.password && touched.password}
                    errorMessage={errors.password}
                >
                    <Field
                        type="password"
                        autoComplete="off"
                        name="password"
                        placeholder={t('UI_Password', { defaultValue: defaultLocale.UI_Password })}
                        component={PasswordInput}
                        prefix={<HiOutlineUser className="text-xl" />}
                    />
                </FormItem>
            )}
        </>
    )
}

export default PersonalInfoForm