import { useCallback, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import Loading from '@/components/shared/Loading'
import { getUserStatistic, useAppDispatch, useAppSelector } from '../../store'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { HiOutlineUsers } from 'react-icons/hi2'
import { LuUserCheck2 } from 'react-icons/lu'
import { NumericFormat } from 'react-number-format'
import type { ReactNode } from 'react'
import { debounce } from 'lodash'
import { useTranslation } from 'react-i18next'
import { defaultLocale } from '@/locales'

type StatisticCardProps = {
    icon: ReactNode
    avatarClass: string
    label: string
    value?: number
    growthRate?: number
    loading: boolean
    className?: string
}

const StatisticCard = (props: StatisticCardProps) => {
    const { icon, avatarClass, label, value, growthRate, loading, className } = props

    const avatarSize = 55

    return (
        <Card bordered className={className}>
            <Loading
                loading={loading}
                customLoader={
                    <MediaSkeleton
                        avatarProps={{
                            className: 'rounded',
                            width: avatarSize,
                            height: avatarSize,
                        }}
                    />
                }
            >
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-4'>
                        <Avatar
                            className={avatarClass}
                            size={avatarSize}
                            icon={icon}
                        />
                        <div>
                            <span>{label}</span>
                            <h3>
                                <NumericFormat
                                    thousandSeparator
                                    displayType='text'
                                    value={value}
                                />
                            </h3>
                        </div>
                    </div>
                    <GrowShrinkTag showIcon={false} value={growthRate} suffix='%' />
                </div>
            </Loading>
        </Card>
    )
}

const UserStatistic = () => {
    const dispatch = useAppDispatch()
    const { t } = useTranslation()

    const statisticData = useAppSelector(
        (state) => state.administrator.reducers.statisticData
    )
    const loading = useAppSelector(
        (state) => state.administrator.reducers.statisticLoading
    )

    const fetchData = useCallback(
        debounce(() => {
            dispatch(getUserStatistic())
        }, 600), [dispatch])

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            {statisticData && statisticData.total && statisticData.total > 0 && <>
                <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-4'>
                    <StatisticCard
                        icon={<HiOutlineUserGroup />}
                        avatarClass='!bg-indigo-600'
                        label={t('UI_ActiveUsers', { defaultValue: defaultLocale.UI_ActiveUsers })}
                        value={statisticData.totalActive}
                        growthRate={parseFloat(((statisticData.totalActive / statisticData.total) * 100).toFixed(2))}
                        loading={loading}
                    />
                    <StatisticCard
                        className='hidden xl:block'
                        icon={<LuUserCheck2 />}
                        avatarClass='!bg-blue-500'
                        label={t('UI_InactiveUsers', { defaultValue: defaultLocale.UI_InactiveUsers })}
                        value={statisticData.totalInactive}
                        growthRate={parseFloat(((statisticData.totalInactive / statisticData.total) * 100).toFixed(2))}
                        loading={loading}
                    />
                    <StatisticCard
                        icon={<HiOutlineUsers />}
                        avatarClass='!bg-sky-500'
                        label={t('UI_VerifyUsers', { defaultValue: defaultLocale.UI_VerifyUsers })}
                        value={statisticData.totalAwaiting}
                        growthRate={parseFloat(((statisticData.totalAwaiting / statisticData.total) * 100).toFixed(2))}
                        loading={loading}
                    />
                    <StatisticCard
                        className='hidden 2xl:block'
                        icon={<HiOutlineUsers />}
                        avatarClass='!bg-sky-500'
                        label={t('UI_WebApplication', { defaultValue: defaultLocale.UI_WebApplication })}
                        value={statisticData.totalWebAppActive}
                        growthRate={100}
                        loading={loading}
                    />
                </div>
            </>}
        </>
    )
}

export default UserStatistic