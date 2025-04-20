import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { setUserRequestTableData, useAppDispatch, useAppSelector } from '../../store';
import {
    components,
    ControlProps,
    OptionProps,
    SingleValue,
} from 'react-select';
import cloneDeep from 'lodash/cloneDeep';
import { HiCheck } from 'react-icons/hi';
import { map } from 'lodash';
import { UserStatus, UserStatusColor, UserStatusEnumIndex } from '@/constants/userStatus.constant';
import { useTranslation } from 'react-i18next';
import { defaultLocale } from '@/locales';

type Option = {
    value: number | null;
    label: string;
    color: string;
};

const { Control } = components;

const CustomSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
}: OptionProps<Option>) => {
    return (
        <div
            className={`flex items-center justify-between p-2 cursor-pointer ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center gap-2">
                <Badge innerClass={data.color} />
                <span>{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    );
};

const CustomControl = ({ children, ...props }: ControlProps<Option>) => {
    const selected = props.getValue()[0];
    return (
        <Control {...props}>
            {selected && (
                <Badge
                    className="ltr:ml-4 rtl:mr-4"
                    innerClass={selected.color}
                />
            )}
            {children}
        </Control>
    );
};

const UserTableFilterStatus = ({ className }: { className?: string }) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const optionIndexs = UserStatusEnumIndex;
    const optionColors = UserStatusColor;
    const options: Option[] = map(optionIndexs, (i) => ({
        value: i,
        label: t(`UI_${UserStatus[i]}`, { defaultValue: UserStatus }),
        color: optionColors[i],
    } as Option));

    const tableData = useAppSelector(
        (state) => state.administrator.reducers.UserRequestTableData
    );

    const onStatusFilterChange = (selected: SingleValue<Option>) => {
        const newTableData = cloneDeep(tableData);
        dispatch(setUserRequestTableData({ ...newTableData, filter: { ...newTableData.filter, status: selected?.value ?? undefined } }));
    };

    return (
        <Select<Option>
            placeholder={t('UI_UserStatus', { defaultValue: defaultLocale.UI_UserStatus })}
            options={options}
            size="sm"
            className={`mb-4 min-w-[165px] ${className}`}
            components={{
                Option: CustomSelectOption,
                Control: CustomControl,
            }}
            value={options.filter((option) => option.value === tableData?.filter?.status)}
            onChange={onStatusFilterChange}
        />
    );
};

export default UserTableFilterStatus;