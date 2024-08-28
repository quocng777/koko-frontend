import { ReactNode, useCallback, useState } from "react"
import { ToastContext } from "../../hook/use-toast"
import { NotificationToast } from "../api/toast/notification-toast"
import { Notification } from "../api/notification/notification-type"

export type ToastProviderProps = {
    children: ReactNode
}

export const ToastProvider = ({children}: ToastProviderProps) => {

    const [notification, setNotification] = useState<Notification | null>(null);

    const handleClose = useCallback(() => {
        setNotification(null);
    }, [])

    const handleOpen = useCallback((notification: Notification) => {
        setNotification(notification);
        setTimeout(() => {
            setNotification(null)
        }, 3000)
    }, []);

    return (
        <ToastContext.Provider value={{open: handleOpen, close: handleClose}}>
            {children}
            <div className="fixed bottom-10 left-10">
                {notification && <NotificationToast notification={notification} onClose={handleClose} />}
            </div>
        </ToastContext.Provider>
    )
}