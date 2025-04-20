import { useState } from 'react'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { HiOutlineArrowCircleRight, HiOutlineLogin } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import {
    useAppDispatch,
} from '../../store'
import { useAppSelector } from '@/store'
import Permissions, { Roles } from '@/constants/authority.constant'
import { Tooltip } from '@/components/ui/Tooltip'

const { ManageUserSwitchUser } = Permissions

export const UserSigninButton = ({ token = '' }: { token: string }) => {
    const { VITE_PUBLISHER_URL, VITE_PUBLISHER_SIGNIN_PATH } = import.meta.env
    const handleOpenNewTab = () => {
        window.open(`${VITE_PUBLISHER_URL}${VITE_PUBLISHER_SIGNIN_PATH}?token=${token}`, '_blank', 'noopener,noreferrer')
    }

    return (
        <Button block icon={<HiOutlineLogin />} onClick={handleOpenNewTab} variant="twoTone" className="mr-2">
            Sign In As Publisher
        </Button>
    )
}

const UserSwitchButton = ({ id, isIcon, name, role, isEmailVerified = true }: { id?: string, isIcon?: boolean, name?: string, role?: string, isEmailVerified?: boolean }) => {

    const dispatch = useAppDispatch()
    const [dialogOpen, setDialogOpen] = useState(false)
    const { authority: userAuthority } = useAppSelector((state) => state.auth.user)

    const deleteAuthority = userAuthority?.includes(ManageUserSwitchUser)

    const navigate = useNavigate()

    const onDialogClose = () => {
        setDialogOpen(false)
    }

    const onDialogOpen = () => {
        setDialogOpen(true)
    }

    const onSwitch = () => {
        setDialogOpen(false)
        if (id) {
            //dispatch(postSwitchUser(id))
        }
        navigate(`/user/${id}`)
    }

    return (
        <>
            {deleteAuthority && role !== Roles.Administrator && isEmailVerified && <>
                {isIcon ?
                    <Tooltip title="Get user tokens" placement="bottom">
                        <span className="cursor-pointer p-2 hover:text-sky-500" onClick={onDialogOpen} >
                            <HiOutlineArrowCircleRight />
                        </span>
                    </Tooltip>
                    :
                    <Button block icon={<HiOutlineArrowCircleRight />} onClick={onDialogOpen}>
                        Get user tokens
                    </Button>
                }
                <ConfirmDialog
                    isOpen={dialogOpen}
                    type="warning"
                    title={`Switch user ${name}`}
                    confirmButtonColor="red-600"
                    onClose={onDialogClose}
                    onRequestClose={onDialogClose}
                    onCancel={onDialogClose}
                    onConfirm={onSwitch}
                >
                    <p>
                        Are you sure you want to get tokens to switch this user?
                    </p>
                </ConfirmDialog>
            </>}
        </>
    )
}

export default UserSwitchButton
