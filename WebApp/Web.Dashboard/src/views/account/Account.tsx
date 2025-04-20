import { useState, useEffect, Suspense } from 'react'
import Tabs from '@/components/ui/Tabs'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import { useNavigate, useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { apiGetProfile } from '@/services/AccountServices'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import debounce from 'lodash/debounce'
import type {
    AccountResponse,
    ProfileResponse,
    ProfileModel,
    ProfileUpdateModel
} from '@/@types/account'
import { settingsMenu, Profile, Password, NotificationSetting, Billing } from './Account.config'
import { useTranslation } from 'react-i18next'
import useMessageErrors from '@/utils/hooks/useMessageErrors'

const { TabNav, TabList } = Tabs

const Account = () => {
    const [currentTab, setCurrentTab] = useState('')
    const [data, setData] = useState<Partial<AccountResponse>>({})

    const navigate = useNavigate()

    const location = useLocation()
    const { t } = useTranslation()

    const path = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    const onTabChange = (val: string) => {
        setCurrentTab(val)
        navigate(`/account/${val}`)
    }

    const fetchData = async () => {
        try {
            const response = await apiGetProfile<ProfileResponse>()
            const datas: AccountResponse = {
                profile: response.data.results,
                loginHistory: [],
            }
            setData(datas)
        } catch (errors: any) {
            const errorMessage = useMessageErrors(errors)
            toast.push(
                <Notification title={errorMessage} type="danger" duration={10000} />,
                { placement: 'top-center' }
            )
        }
    }

    const debounceFuncApiGetAccountData = debounce(fetchData, 200)

    useEffect(() => {
        if (isEmpty(data)) {
            debounceFuncApiGetAccountData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (path !== currentTab) {
            setCurrentTab(path)
        }
    }, [currentTab, path])

    const updateProfileData = (updateData: ProfileUpdateModel) => {
        const { displayName, phoneNumber, address } = updateData
        // eslint-disable-next-line no-console
        setData((prevState) => ({
            ...prevState,
            profile: {
                ...prevState.profile,
                displayName,
                phoneNumber,
                address
            } as ProfileModel
        }))
    }

    return (
        <Container>
            <AdaptableCard>
                <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
                    <TabList>
                        {Object.keys(settingsMenu).map((key) => (
                            <TabNav key={key} value={key}>
                                {t(settingsMenu[key].lang, settingsMenu[key].label)}
                            </TabNav>
                        ))}
                    </TabList>
                </Tabs>
                <div className="px-4 py-6">
                    <Suspense fallback={<></>}>
                        {currentTab === 'profile' && (
                            <Profile data={data.profile} updateProfileFn={updateProfileData} />
                        )}
                        {currentTab === 'password' && (
                            <Password data={data.loginHistory} />
                        )}
                        {currentTab === 'notification' && (
                            <NotificationSetting data={data.notification} />
                        )}
                        {currentTab === 'billing' && <Billing />}
                    </Suspense>
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default Account