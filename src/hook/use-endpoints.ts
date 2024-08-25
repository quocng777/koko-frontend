import { useSelector } from "react-redux"
import { getCurrentAuthentication } from "../app/api/auth/auth-slice"

export const useEndpoints = () => {
    const user = useSelector(getCurrentAuthentication);
    return {
        'MESSAGE_COME': `/user/${user.id}/message`,
        'MESSAGE_TYPING': (conservationId: string) => {
            return `/messages/typing/${conservationId}`
        },
        'MESSAGE_SEEN': `/user/${user.id}/message/seen`,
        'MESSAGE_DELETE': `/user/${user.id}/message/delete`
    }
};