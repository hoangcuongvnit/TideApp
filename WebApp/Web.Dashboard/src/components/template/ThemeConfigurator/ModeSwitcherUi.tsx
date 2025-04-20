import ModeSwitcher from "./ModeSwitcher"
import { useTranslation } from 'react-i18next'

const ModeSwitcherUi = () => {
    const { t } = useTranslation()

    return (
        <div className="py-2 px-3 flex items-center gap-2">
            <ModeSwitcher />
            <div className="font-bold text-gray-900 dark:text-gray-100">
                {t('settings.darkMode', 'Dark Mode')}
            </div>
        </div>
    )
}

export default ModeSwitcherUi