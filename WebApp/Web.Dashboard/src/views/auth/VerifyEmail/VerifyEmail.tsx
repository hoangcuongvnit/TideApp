import ActionLink from '@/components/shared/ActionLink'
import { useEffect, useState } from 'react'
import useQuery from '@/utils/hooks/useQuery'
import { RESET_TOKEN_KEY, RESET_ID_KEY } from '@/constants/app.constant'
import isEmpty from 'lodash/isEmpty'
import { apiVerifyEmail } from '@/services/AuthService'
import debounce from 'lodash/debounce'
import Alert from '@/components/ui/Alert'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useMessageErrors from '@/utils/hooks/useMessageErrors'
import { useTranslation } from 'react-i18next'
import { defaultLocale } from '@/locales/locales'

const VerifyEmail = () => {
    const signInUrl = '/sign-in'
    const { t } = useTranslation()

    const query = useQuery()
    const [message, setMessage] = useTimeOutMessage(0)
    const [isVerified, setIsVerified] = useState(false)

    const fetchData = async (id: string, token: string) => {
        try {
            const resp = await apiVerifyEmail({ id, token })
            if (resp.data) {
                const { messages: { message, key } } = resp.data
                setIsVerified(true)
                setMessage(message, key)
            }
        } catch (errors: any) {
            useMessageErrors(errors, undefined, setMessage)
        }
    }
    const debounceFuncApiVerifyEmail = debounce(async (id: string, token: string) => await fetchData(id, token), 100)

    useEffect(() => {
        const verifyToken = query.get(RESET_TOKEN_KEY) || ''
        const verifyId = query.get(RESET_ID_KEY) || ''
        if (!isEmpty(verifyToken) && !isEmpty(verifyId)) {
            debounceFuncApiVerifyEmail(verifyId, verifyToken)
        }
    }, [])

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">{t('UI_VerifyEmail', { defaultValue: defaultLocale.UI_VerifyEmail })}</h3>
                {!isVerified && <p>{t('UI_VerifyEmailMessage', { defaultValue: defaultLocale.UI_VerifyEmailMessage })}</p>}
                {message && (
                    <Alert showIcon className="mb-4 mt-4" type={isVerified ? "success" : "danger"}>
                        {message}
                    </Alert>
                )}
            </div>
            <div className="mt-8 text-center">
                {!isVerified && <span>{t('UI_HaveYouVerified', { defaultValue: defaultLocale.UI_HaveYouVerified })} </span>}
                {isVerified && <span>{t('UI_PleaseClick', { defaultValue: defaultLocale.UI_PleaseClick })} </span>}
                <ActionLink to={signInUrl}>{t('UI_SignIn', { defaultValue: defaultLocale.UI_SignIn })}</ActionLink>
            </div>
        </>
    )
}

export default VerifyEmail