import { NavLink, Outlet } from "react-router-dom";
import { BiHomeAlt2 } from "react-icons/bi";
import { IconType } from "react-icons";
import { BiMessageRounded } from "react-icons/bi";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { BiBell } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentAuthentication } from "../app/api/auth/auth-slice";
import { Avatar } from "../components/avatar";
import { useGetConservationsQuery } from "../app/api/conservation/conservation-api-slice";
import { useEffect } from "react";
import { ConservationType } from "../app/api/conservation/conservation-type";
import defaultUserImage from "../assets/default_avatar.png";
import { addConservation, clearConservations } from "../app/api/conservation/conservation-slice";
import { useLazyGetLatestMessageQuery, useLazyGetNumUnreadMsgQuery } from "../app/api/message/message-api-slice";
import { Message } from "../app/api/message/message-type";
import { addMessage } from "../app/api/message/message-slice";
import useSocket from "../app/api/socket";
import { useGetNumNotificationQuery } from "../app/api/notification/notification-api-slice";
import { setNumNotification } from "../app/api/notification/notification-slice";
import { RootState } from "../app/api/store";
import { ToastProvider } from "../app/context/toast-provider";

type SideNavigationItem = {
    name: string,
    to: string,
    icon: IconType
};

const navigation: SideNavigationItem[] = [
    {
        name: 'Home',
        to: '/home',
        icon: BiHomeAlt2
    },
    {
        name: 'Messages',
        to: '/messages',
        icon: BiMessageRounded
    },
    {
        name: 'Friends',
        to: '/friends',
        icon: LiaUserFriendsSolid
    },
    {
        name: 'Notification',
        to: '/notifications',
        icon: BiBell
    },
    {
        name: 'Setting',
        to: '/setting',
        icon: IoSettingsOutline
    }
]

export const MainLayout = () => {

    const user = useSelector(getCurrentAuthentication);
    const notification = useSelector((state: RootState) => state.notification);

    const { data, isSuccess } = useGetConservationsQuery();

    const [ getLatestMessage ] = useLazyGetLatestMessageQuery();

    const [ getNumUnreadMessage ] = useLazyGetNumUnreadMsgQuery();
    const { data: numNotification, isSuccess: isGetNotiSuccess } = useGetNumNotificationQuery();

    const dispatch = useDispatch();

    useSocket();
 
    useEffect(() => {

        async function fetchConservation(
        ) {
            if(isSuccess) {
                const conservations = data.data || [];
                dispatch(clearConservations());
                for(let conservation of conservations) {
                    let formatConservation = {
                        ...conservation
                    };
    
                    if(conservation.type == ConservationType.SINGLE) {
                        let otherUser = conservation.participants.filter(par => par.userId != user.id)[0];
                        formatConservation.name = otherUser.name;
                        formatConservation.avatar = otherUser.userAvatar || defaultUserImage;
                    }
    
                    let latestMessage: Message | undefined;
                    let unread = 0;
    
                    try {
                        latestMessage = (await getLatestMessage({conservation: conservation.id}).unwrap()).data as Message;
                        dispatch(addMessage(latestMessage as Message))

                        unread = (await getNumUnreadMessage({conservation: conservation.id}).unwrap()).data as number;
                    } catch(exc) {
                    }
    
                    const transformedCons =  {
                        ...formatConservation,
                        lastMessage: latestMessage,
                        unread
                    }

                    dispatch(addConservation(transformedCons))
                }
            }
        }
        fetchConservation()
    }, [isSuccess])

    useEffect(() => {
        if(isGetNotiSuccess) {
            dispatch(setNumNotification(numNotification.data!))
        }
    }, [isGetNotiSuccess, numNotification])

    return (
            <div className="flex w-full">
            <header className="max-h-screen shrink-0 h-screen w-[24rem] max-lg:w-36">
                <div className="flex flex-col gap-6 w-[24rem] max-lg:w-36 py-8 px-8 h-full fixed  overflow-y-auto">
                    <NavLink to={'/user'} className="bg-background px-12 py-6 rounded-2xl flex gap-4 hover:bg-background-hover cursor-pointer shadow-sm items-center max-lg:px-0 max-lg:justify-center">
                            <Avatar src={user.avatar}/>
                            <div className="max-lg:hidden">
                                <p className="font-bold mb-2">{user.name}</p>
                                <p className="text-gray-500">@{user.username}</p>
                            </div>
                    </NavLink>
                    <nav className="flex flex-col bg-background px-4 py-4 rounded-2xl text-xl shadow-sm flex-1 max-lg:px-2 font-medium">
                        {navigation.map(item => (
                            <NavLink 
                                key={item.to} 
                                to={item.to}
                                className={({isActive}) => twMerge(
                                    'flex items-center gap-6 px-8 py-4 hover:bg-background-hover rounded-3xl transition-all max-lg:px-0 max-lg:justify-center max-lg:rounded-full',
                                    isActive ? 'text-sky-400' : ''
                                )}>
                                <div className="relative">
                                    <item.icon className="shrink-0"/>
                                    {item.name === 'Notification' && notification.numNotification > 0 && <div className="text-xs text-white bg-red-500 size-4 flex shrink-0 justify-center items-center rounded-full absolute -top-1 -right-2">{notification.numNotification}</div>}
                                </div>
                                <span className="max-lg:hidden">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </header>
            <Outlet />
        </div>
    )
}