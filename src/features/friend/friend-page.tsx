import { NavLink, Outlet } from "react-router-dom";
import { twMerge } from "tailwind-merge";

type TabProps = {
    label: string,
    url: string
}

const tabs: TabProps[] = [
    {
        label: 'Your friends',
        url: '/friends'
    },
    {
        label: 'Requests',
        url: '/friends/requests'
    },
    {
        label: 'Suggestion',
        url: '/friends/suggestion'
    }
]

export const FriendPage = () => {
    return (
        <div className="py-8 w-full flex">
            <div className="bg-background w-full px-6 py-4 rounded-2xl text-slate-700 flex flex-col min-h-full mr-8">
                <h3 className="text-lg font-semibold">Friends</h3>
                <div className="mt-5 flex-1 flex flex-col">
                    <div className="flex w-full justify-between sticky top-0 bg-background">
                        {
                            tabs.map(
                                tab => ( <NavLink key={tab.label} to={tab.url} className={({isActive}) => {
                                    return (
                                        twMerge(`${isActive ? 'text-sky-400' : ''}`,
                                            'font-semibold px-4 hover:bg-background-hover rounded-lg flex-1 flex justify-center transition-all'
                                        )
                                    )
                                }} end>
                                    {({ isActive }) => (
                                            <div className={`py-3 w-fit ${isActive ? 'border-b-[3px] border-sky-400' : ''}`}>
                                                {tab.label}
                                            </div>
                                    )}
                                </NavLink>)
                            )
                        }
                    </div>
                    <div className="mt-4 w-full flex-1 min-h-0">
                        <Outlet />
                    </div>
                </div>
            </div>
            <div className="w-[36rem] max-lg:hidden">
            </div>
        </div>
    )
};