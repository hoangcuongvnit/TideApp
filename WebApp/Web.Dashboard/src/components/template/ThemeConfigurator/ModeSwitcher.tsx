import { useCallback } from 'react'
import useDarkMode from '@/utils/hooks/useDarkmode'
import Switcher from '@/components/ui/Switcher'
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri'
import type { ReactNode } from 'react'

const withIcon = (component: ReactNode) => {
    return <div className="text-lg">{component}</div>
}

const ModeSwitcher = () => {
    const [isDark, setIsDark] = useDarkMode()

    const onSwitchChange = useCallback(
        (checked: boolean) => {
            setIsDark(checked ? 'dark' : 'light')
        },
        [setIsDark]
    )

    return (
        <div>
            <Switcher
                defaultChecked={isDark}
                onChange={(checked) => onSwitchChange(checked)}
                unCheckedContent={withIcon(<RiMoonClearLine />)}
                checkedContent={withIcon(<RiSunLine />)}
            />
        </div>
    )
}

export default ModeSwitcher
