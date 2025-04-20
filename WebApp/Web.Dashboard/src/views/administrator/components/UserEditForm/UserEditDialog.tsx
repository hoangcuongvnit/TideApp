import { useRef } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import UserEditContent, { FormikRef } from './UserEditContent'
import {
    setDrawerClose,
    useAppDispatch,
    useAppSelector,
} from '../../store'
import type { MouseEvent } from 'react'

type DrawerFooterProps = {
    onSaveClick: (event: MouseEvent<HTMLButtonElement>) => void
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void
}

type UserEditDialogProps = {
    onCloseDialog: (data: any) => void
}

const DrawerFooter = ({ onSaveClick, onCancel }: DrawerFooterProps) => {
    return (
        <div className='text-left w-full'>
            <Button size='sm' className='mr-2' onClick={onCancel}>
                Cancel
            </Button>
            <Button size='sm' variant='solid' onClick={onSaveClick}>
                Save
            </Button>
        </div>
    )
}

const UserEditDialog = ({ onCloseDialog }: UserEditDialogProps) => {
    const dispatch = useAppDispatch()
    const { drawerOpen } = useAppSelector(
        (state) => state.administrator.reducers
    )

    const onDrawerClose = () => {
        dispatch(setDrawerClose())
    }

    const formikRef = useRef<FormikRef>(null)

    const formSubmit = () => {
        formikRef.current?.submitForm()
    }

    return (
        <Drawer
            isOpen={drawerOpen}
            closable={false}
            bodyClass='p-0'
            width={510}
            footer={
                <DrawerFooter
                    onCancel={onDrawerClose}
                    onSaveClick={formSubmit}
                />
            }
            onClose={onDrawerClose}
            onRequestClose={onDrawerClose}
        >
            <UserEditContent ref={formikRef} cleanData={onDrawerClose} updateData={onCloseDialog} />
        </Drawer>
    )
}

export default UserEditDialog
