import { defaultLocale } from '@/locales/locales'
import SignInForm from './SignInForm'
import { useTranslation } from 'react-i18next'

const SignIn = () => {
    const { t } = useTranslation()

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">{t('UI_WelcomeBack', { defaultValue: defaultLocale.UI_WelcomeBack })}</h3>
                <p>{t('UI_PleaseEnterYourCredentials', { defaultValue: defaultLocale.UI_PleaseEnterYourCredentials })}</p>
            </div>
            <SignInForm disableSubmit={false} />
        </>
    )
}

export default SignIn