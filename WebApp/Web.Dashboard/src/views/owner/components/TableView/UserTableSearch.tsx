import { forwardRef } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'
import debounce from 'lodash/debounce'
import type { ChangeEvent } from 'react'

type UserTableSearchProps = {
    onInputChange: (value: string) => void
    placeholder?: string
    className?: string
}

const UserTableSearch = forwardRef<
    HTMLInputElement,
    UserTableSearchProps
>((props, ref) => {
    const { onInputChange, placeholder, className } = props

    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(value: string) {
        onInputChange?.(value)
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    return (
        <Input
            ref={ref}
            className={`max-w-md mb-4 ${className}`}
            size="sm"
            placeholder={placeholder ?? "Search"}
            prefix={<HiOutlineSearch className="text-lg" />}
            onChange={handleInputChange}
        />
    )
})

UserTableSearch.displayName = 'UserTableSearch'

export default UserTableSearch
