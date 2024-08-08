import { NavLink, Outlet } from "react-router-dom";
import { BiHomeAlt2 } from "react-icons/bi";
import { IconType } from "react-icons";
import { BiMessageRounded } from "react-icons/bi";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { BiBell } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { useSelector } from "react-redux";
import { getCurrentAuthentication } from "../app/api/auth/auth-slice";
import { Avatar } from "../components/avatar";

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

    return (
        <div className="flex min-h-screen w-full font-medium">
            <header>
                <div className="flex flex-col gap-6 w-[24rem] py-8 mb-8 px-8 h-full max-md:w-36">
                    <NavLink to={'/user'} className="bg-background px-12 py-6 rounded-2xl flex gap-4 hover:bg-background-hover cursor-pointer shadow-sm items-center max-md:px-0 max-md:justify-center">
                            <Avatar src={user.avatar}/>
                            <div className="max-md:hidden">
                                <p className="font-bold mb-2">{user.name}</p>
                                <p className="text-gray-500">@{user.username}</p>
                            </div>
                    </NavLink>
                    <nav className="flex flex-col bg-background px-4 py-4 rounded-2xl text-xl shadow-sm flex-1 max-md:px-2">
                        {navigation.map(item => (
                            <NavLink 
                                key={item.to} 
                                to={item.to}
                                end
                                className={({isActive}) => twMerge(
                                    'flex items-center gap-6 px-8 py-4 hover:bg-background-hover rounded-3xl transition-all max-md:px-0 max-md:justify-center max-md:rounded-full',
                                    isActive ? 'text-sky-400' : ''
                                )}>
                                <item.icon className="shrink-0"/>
                                <span className="max-md:hidden">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </header>
            <Outlet />
        </div>
    )
}