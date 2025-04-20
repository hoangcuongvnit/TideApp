import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import { useTranslation } from 'react-i18next'
import { defaultLocale } from '@/locales'

const AccessDenied = () => {
    const { t } = useTranslation()

    return (
        <Container className="h-full">
            <div className="h-full flex flex-col items-center justify-center">
                <DoubleSidedImage
                    src="/img/others/img-2.png"
                    darkModeSrc="/img/others/img-2-dark.png"
                    alt={t('UI_AccessDenied', { defaultValue: defaultLocale.UI_AccessDenied })}
                />
                <div className="mt-6 text-center">
                    <h3 className="mb-2">{t('UI_AccessDenied', { defaultValue: defaultLocale.UI_AccessDenied })}</h3>
                    <p className="text-base">
                        {t('UI_NoPermission', { defaultValue: defaultLocale.UI_NoPermission })}
                    </p>
                </div>
            </div>
        </Container>
    )
}

export default AccessDenied