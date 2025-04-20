import Select from '@/components/ui/Select'
import { setUserRequestTableData, useAppDispatch, useAppSelector } from '../../store'
import {
    components,
    ControlProps,
    OptionProps,
    SingleValue,
} from 'react-select'
import cloneDeep from 'lodash/cloneDeep'
import { HiCheck } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { map, orderBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import { defaultLocale } from '@/locales'

type Option = {
    value: string | null
    label: string
}

const { Control } = components

const CustomSelectOption = ({
    innerProps,
    label,
    isSelected,
}: OptionProps<Option>) => {
    return (
        <div
            className={`flex items-center justify-between p-2 cursor-pointer ${isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
            {...innerProps}
        >
            <div className="flex items-center gap-2">
                <span>{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

const CustomControl = ({ children, ...props }: ControlProps<Option>) => {
    return (
        <Control {...props}>
            {children}
        </Control>
    )
}

const UserTableFilterRole = () => {
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const [options, setOptions] = useState<Option[]>([{ value: null, label: t('UI_All', { defaultValue: defaultLocale.UI_All }) }])

    const tableData = useAppSelector(
        (state) => state.owner.reducers.UserRequestTableData
    )

    const roles = useAppSelector(
        (state) => state.owner.reducers.roles
    )

    useEffect(() => {
        if (roles && roles.length > 0) {
            const listRole = orderBy(roles, ['order'], ['asc'])
            setOptions(map(listRole, (role) => ({ value: role.name, label: t(`UI_${role.localeKey}`, role.name) })))
        }
    }, [roles, t])

    const onStatusFilterChange = (selected: SingleValue<Option>) => {
        const newTableData = cloneDeep(tableData)

        dispatch(setUserRequestTableData({ ...newTableData, filter: { ...newTableData.filter, role: selected?.value ?? undefined } }))
    }

    return (
        <Select<Option>
            placeholder={t('UI_SelectRole', { defaultValue: defaultLocale.UI_SelectRole })}
            options={options}
            size="sm"
            className="mb-4 min-w-[160px]"
            components={{
                Option: CustomSelectOption,
                Control: CustomControl,
            }}
            value={options.filter((option) => option.value === tableData?.filter?.role)}
            onChange={onStatusFilterChange}
        />
    )
}

export default UserTableFilterRole