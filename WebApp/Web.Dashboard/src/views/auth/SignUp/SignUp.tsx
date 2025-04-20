import { defaultLocale } from '@/locales/locales'
import SignUpForm from './SignUpForm'
import { useTranslation } from 'react-i18next'

const SignUp = () => {
    const { t } = useTranslation()

    return (
        <div>
            <div className="mb-8">
                <h3 className="mb-1">{t('UI_SignUp', { defaultValue: defaultLocale.UI_SignUp })}</h3>
                <p>{t('UI_GetStartedWithFreeTrial', { defaultValue: defaultLocale.UI_GetStartedWithFreeTrial })}</p>
            </div>
            <SignUpForm disableSubmit={false} />
        </div>
    )
}

export default SignUp