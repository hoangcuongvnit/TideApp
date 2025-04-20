import HorizontalMenuContent from './HorizontalMenuContent'
import useResponsive from '@/utils/hooks/useResponsive'
import { useAppSelector } from '@/store'

const HorizontalNav = () => {
    const mode = useAppSelector((state) => state.theme.mode)
    const {authority: userAuthority, role} = useAppSelector((state) => state.auth.user)

    const { larger } = useResponsive()

    return (
        <>
            {larger.md && (
                <HorizontalMenuContent
                    manuVariant={mode}
                    userAuthority={userAuthority}
                    role={role ?? ''}
                />
            )}
        </>
    )
}

export default HorizontalNav
