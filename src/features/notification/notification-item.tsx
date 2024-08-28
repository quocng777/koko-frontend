import { NavLink } from "react-router-dom";
import { Notification, NotificationType } from "../../app/api/notification/notification-type";
import { IoMdPersonAdd } from "react-icons/io";
import { Avatar } from "../../components/avatar";

export type NotificationProps = {
    notification: Notification
}

export const NotificationItem = ( {notification} : NotificationProps ) => {
    return (
        <div className="w-full">
            <NavLink to={notification.objectUrl} className='flex hover:bg-background-hover px-4 py-4  transition-all rounded-xl' >
                {
                    (notification.type == NotificationType.FRIEND_REQUEST || notification.type == NotificationType.FRIEND_ACCEPT) && <div className="flex items-center justify-center mr-12 shrink-0 text-xl">
                        <IoMdPersonAdd className="text-sky-400" />
                    </div>
                }
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <Avatar src={notification.publishedUser.avatar} size="xs" className="self-start" />
                        <div className="flex flex-col text-wrap break-all">
                            <p className={!notification.seenAt ? 'font-medium': ''}>
                            &nbsp;{notification.publishedUser.name}
                            &nbsp;
                            { (notification.type == NotificationType.FRIEND_REQUEST) && 'sent you a friend request' }
                            { (notification.type == NotificationType.FRIEND_ACCEPT) && 'accepted your friend request' }
                        </p>
                        <span className="text-sm mt-2">1m ago</span>
                        </div>
                    </div>
                </div>
                <div className="w-8 shrink-0 justify-center items-center flex">
                    {!notification.seenAt && <div className="size-3 bg-sky-400 rounded-full"></div>}
                </div>
            </NavLink>
        </div>
    )
};