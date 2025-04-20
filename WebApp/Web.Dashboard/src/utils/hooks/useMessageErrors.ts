import { ApiErrorKeyDefault, ErrorDetails } from "@/configs/app.config"
import { t } from "i18next"
import { forEach, keys, map, remove } from "lodash"


function useMessageErrors(
    errors: {
        [key: string]: ErrorDetails[] | []
    },
    setErrors?: (errors: any) => void | null,
    setMessage?: Function) {
    const errorKeys = keys(errors)
    remove(errorKeys, (key) => key === ApiErrorKeyDefault)
    if (errorKeys && errorKeys.length > 0) {
        let messageList: { [key: string]: string[] } = {}
        forEach(errorKeys, (key: string) => {
            messageList[toLowerFirstChar(key)] = map(errors[key], (item) => t(item.key, item.message).toString() + ' ')
        })
        if (setErrors && setErrors !== null) setErrors(messageList)
    }

    if (!errors || !errors[ApiErrorKeyDefault]) return

    const messages = map(errors[ApiErrorKeyDefault], (item) => t(item.key, item.message))
    if (messages && messages.length > 0) {
        let message = ''
        forEach(messages, (item) => message += '' + item + '\n')
        if (setMessage && typeof setMessage === 'function') {
            setMessage(message)
        }
        return message
    }

    return
}

function toLowerFirstChar(key: string): string {
    if (!key) return key;
    return key.charAt(0).toLowerCase() + key.slice(1);
}

export default useMessageErrors