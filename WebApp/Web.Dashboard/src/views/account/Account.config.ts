import { lazy } from 'react'

export const Profile = lazy(() => import('./components/Profile'))
export const Password = lazy(() => import('./components/Password'))
export const NotificationSetting = lazy(
    () => import('./components/NotificationSetting')
)
export const Billing = lazy(() => import('./components/Billing'))

export const settingsMenu: Record<
    string,
    {
        lang: string
        label: string
        path: string
    }
> = {
    profile: { lang: 'UI_Profile', label: 'Profile', path: 'profile' },
    password: { lang: 'UI_Password', label: 'Password', path: 'password' },
    notification: { lang: 'UI_Notification', label: 'Notification', path: 'notification' },
    billing: { lang: 'UI_Billing', label: 'Billing', path: 'billing' },
}