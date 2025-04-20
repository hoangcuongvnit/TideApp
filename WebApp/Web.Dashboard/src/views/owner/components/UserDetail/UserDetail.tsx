import { useCallback, useEffect } from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import UserProfile from './UserProfile'
import { getClaims, getRoles, getUser, setUserDetail, useAppDispatch, useAppSelector } from '../../store'
import isEmpty from 'lodash/isEmpty'
import { useParams } from 'react-router-dom'
import CurrentSubscription from './CurrentSubscription'
import Permissions from './Permissions'
import { debounce } from 'lodash'

const UserDetail = () => {
    const dispatch = useAppDispatch()
    const { id } = useParams()

    const { userDetail : data, loading, roles, claims } = useAppSelector(
        (state) => state.owner.reducers
    )

    const fetchUserData = useCallback(
        debounce(() => {
            if (id) {
                dispatch(getUser(id))
            }
        }, 300), [id, data, dispatch]
    )
    const fetchRoleData = useCallback(
        debounce(() => {
            if (!roles || roles.length === 0) {
                dispatch(getRoles())
            }
        }, 300), [roles, dispatch]
    )
    const fetchClaimData = useCallback(
        debounce(() => {
            if (!claims || claims.length === 0) {
                dispatch(getClaims())
            }
        }, 300), [claims, dispatch]
    )

    useEffect(() => {
        fetchUserData()
        fetchRoleData()
        fetchClaimData()

        return () => {
            dispatch(setUserDetail({}))
        }
    }, [])

    return (
        <Container className="h-full">
            <Loading loading={loading}>
                {!isEmpty(data) && (
                    <div className="flex flex-col xl:flex-row gap-4">
                        <div>
                            <UserProfile data={data} roles={roles} />
                        </div>
                        <div className="w-full">
                            <AdaptableCard divider shadow bordered>
                                <CurrentSubscription />
                                <Permissions claims={claims} userClaims={data.roleClaims} />
                            </AdaptableCard>
                        </div>
                    </div>
                )}
            </Loading>
            {!!data && data.id === '' && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No user found!"
                    />
                    <h3 className="mt-8">No user found!</h3>
                </div>
            )}
        </Container>
    )
}

export default UserDetail
