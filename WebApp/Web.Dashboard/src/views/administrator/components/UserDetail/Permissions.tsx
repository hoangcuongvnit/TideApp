import Checkbox from '@/components/ui/Checkbox';
import Card from '@/components/ui/Card';
import { includes } from 'lodash';
import { useTranslation } from 'react-i18next';
import { defaultLocale } from '@/locales';

type PermissionsFormProps = {
    claims: string[] | [];
    userClaims: string[] | undefined;
};

const Permissions = ({ claims, userClaims }: PermissionsFormProps) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="mb-8">
                <h6 className="mb-4">{t('UI_UserAccess', { defaultValue: defaultLocale.UI_UserAccess })}</h6>
                <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4'>
                    {claims && claims.map((claim) => (
                        <div key={`claim-key-${claim}`} className='mb-2 flex'>
                            <Checkbox name={claim} checked={includes(userClaims, claim)} readOnly />
                            <label htmlFor={claim}>{t(`AC_${claim}`, { defaultValue: claim })}</label>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Permissions;