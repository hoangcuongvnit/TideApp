import { useEffect, useState } from 'react'

function useTimeOutMessage(
    interval = 8000
): [string, Function] {
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (message && interval !== 0) {
            const timeout = setTimeout(() => setMessage(''), interval)
            return () => {
                clearTimeout(timeout)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message])

    return [message, setMessage]
}

export default useTimeOutMessage
