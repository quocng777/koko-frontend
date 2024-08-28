import { useEffect, useState } from "react";
import { Notification } from "../../app/api/notification/notification-type";
import { NotificationItem } from "./notification-item";
import { useGetNotificationsQuery } from "../../app/api/notification/notification-api-slice";


export const NotificationPage = () => {

    const [ notifications, setNotifications ] = useState<Notification[]>([]);
    const [ hasMore, setHasMore ] = useState(false);

    const { isSuccess, data } = useGetNotificationsQuery({
        pageNum: 0,
        pageSize: 10
    });

    useEffect(() => {
        if(isSuccess) {
            setNotifications(data.data!.list);
            if(data.data!.pageNum + 1 < data.data!.totalPages) {
                setHasMore(true);
            }
        }
    }, [ isSuccess ])

    return (
        <div className="min-h-screen w-full flex py-8">
            <div className="h-full bg-background py-4 px-6 w-full mr-8 rounded-2xl text-slate-600">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <div className="flex flex-col gap-1 mt-3">
                    {
                        notifications.map(noti => {
                            return (
                                <NotificationItem key={noti.id} notification={noti} />
                            )
                        })
                    }
                </div>
            </div>
            <div className="max-lg:hidden w-[36rem]">

            </div>
        </div>
    )
};