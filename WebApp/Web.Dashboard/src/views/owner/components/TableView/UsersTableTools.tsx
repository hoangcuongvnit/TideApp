import { useRef } from 'react';
import Button from '@/components/ui/Button';
import {
    setUserRequestTableData,
    UserRequestSearch,
    useAppDispatch,
    useAppSelector,
} from '../../store';
import cloneDeep from 'lodash/cloneDeep';
import { debounce } from 'lodash';
import UserTableSearch from './UserTableSearch';
import UserTableFilterRole from './UserTableFilterRole';
import UserTableFilterStatus from './UserTableFilterStatus';
import { PiArrowsCounterClockwiseThin } from 'react-icons/pi';
import { HiTrash } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import { defaultLocale } from '@/locales';

const UsersTableTools = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const inputRef = useRef<HTMLInputElement>(null);

    const tableData = useAppSelector(
        (state) => state.owner.reducers.UserRequestTableData
    );

    const handleInputNameChange = (val: string) => {
        const newTableData = cloneDeep(tableData);
        newTableData.pagination.page = 1;
        const filter = newTableData.filter;

        if (typeof val === 'string' && val.length > 1) {
            fetchData({ ...newTableData, filter: { ...filter, name: val } });
        }

        if (typeof val === 'string' && val.length === 0) {
            fetchData({ ...newTableData, filter: { ...filter, name: undefined } });
        }
    };
    const debounceHandleInputNameChange = debounce(handleInputNameChange, 400);

    const handleInputEmailChange = (val: string) => {
        const newTableData = cloneDeep(tableData);
        newTableData.pagination.page = 1;
        const filter = newTableData.filter;

        if (typeof val === 'string' && val.length > 1) {
            fetchData({ ...newTableData, filter: { ...filter, email: val } });
        }

        if (typeof val === 'string' && val.length === 0) {
            fetchData({ ...newTableData, filter: { ...filter, email: undefined } });
        }
    };
    const debounceHandleInputEmailChange = debounce(handleInputEmailChange, 400);

    const handleInputPhoneNumberChange = (val: string) => {
        const newTableData = cloneDeep(tableData);
        newTableData.pagination.page = 1;
        const filter = newTableData.filter;

        if (typeof val === 'string' && val.length > 1) {
            fetchData({ ...newTableData, filter: { ...filter, phoneNumber: val } });
        }

        if (typeof val === 'string' && val.length === 0) {
            fetchData({ ...newTableData, filter: { ...filter, phoneNumber: undefined } });
        }
    };
    const debounceHandleInputPhoneNumberChange = debounce(handleInputPhoneNumberChange, 400);

    const fetchData = (data: UserRequestSearch) => {
        dispatch(setUserRequestTableData(data));
    };

    const onClearAll = () => {
        const newTableData = cloneDeep(tableData);
        newTableData.filter = {};
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        fetchData(newTableData);
    };

    const reload = () => {
        const newTableData = { ...tableData, isReload: !tableData.isReload };
        fetchData(newTableData);
    };

    return (
        <div className='md:flex items-center justify-between'>
            <div className='grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4'>
                <UserTableSearch
                    className='hidden 2xl:block'
                    ref={inputRef}
                    onInputChange={debounceHandleInputNameChange}
                    placeholder={t('UI_Name', { defaultValue: defaultLocale.UI_Name })}
                />
                <UserTableSearch
                    ref={inputRef}
                    onInputChange={debounceHandleInputEmailChange}
                    placeholder={t('UI_Email', { defaultValue: defaultLocale.UI_Email })}
                />
                <UserTableSearch
                    className='hidden 2xl:block'
                    ref={inputRef}
                    onInputChange={debounceHandleInputPhoneNumberChange}
                    placeholder={t('UI_PhoneNumber', { defaultValue: defaultLocale.UI_PhoneNumber })}
                />
                <UserTableFilterRole />
                <UserTableFilterStatus className='hidden xl:block' />
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-2 mb-4'>
                <Button className='mr-4 hidden lg:block' size='sm' icon={<PiArrowsCounterClockwiseThin />} onClick={reload}>
                    <span className='hidden 2xl:block'>{t('UI_Reload', { defaultValue: defaultLocale.UI_Reload })}</span>
                </Button>
                <Button size='sm' icon={<HiTrash />} onClick={onClearAll}>
                    <span className='hidden 2xl:block'>{t('UI_ClearAll', { defaultValue: defaultLocale.UI_ClearAll })}</span>
                </Button>
            </div>
        </div>
    );
};

export default UsersTableTools;