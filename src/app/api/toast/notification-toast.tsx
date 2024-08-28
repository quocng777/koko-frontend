import { NavLink } from "react-router-dom"
import { Notification, NotificationType } from "../notification/notification-type"
import { IoMdPersonAdd } from "react-icons/io"
import { Avatar } from "../../../components/avatar"
import { Button } from "../../../components/buttons/button"
import { RxCross2 } from "react-icons/rx";
import { MouseEventHandler } from "react"

export const NotificationToast = ({ notification, onClose }: { notification: Notification, onClose: () => void }) => {

    const handleCloseClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        onClose();
    }

    return (
        <div>
             <NavLink to={'dsfas'} className='flex hover:bg-background-hover px-6 py-8 max-w-[26rem]  transition-all rounded-xl bg-background-active bg-opacity-85 relative' >
                {
                    (notification.type == NotificationType.FRIEND_REQUEST || notification.type == NotificationType.FRIEND_ACCEPT) && <div className="flex items-center justify-center mr-8 shrink-0 text-xl">
                        <IoMdPersonAdd className="text-sky-400" />
                    </div>
                }

                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <Avatar src={notification.publishedUser.avatar} size="xs" className="self-start" />
                        <div className="flex flex-col text-wrap">
                            <p className={!notification.seenAt ? 'font-medium': ''}>
                            {notification.publishedUser.name}
                            &nbsp;
                            { (notification.type == NotificationType.FRIEND_REQUEST) && 'sent you a friend request' }
                            { (notification.type == NotificationType.FRIEND_ACCEPT) && 'accepted your friend request' }
                        </p>
                        </div>
                    </div>
                </div>

                <Button variant="ghost" size="icon" className="absolute top-2 right-2 hover:text-red-600" onClick={handleCloseClick} >
                    <RxCross2 />
                </Button>
            </NavLink>
        </div>
    )
}