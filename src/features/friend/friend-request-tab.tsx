import { useEffect, useState } from "react";
import {  useGetReceivedFriendRequestsQuery } from "../../app/api/user/user-api-slice";
import { UserFriend } from "../../app/api/user/user-type";
import { NavLink } from "react-router-dom";
import { Avatar } from "../../components/avatar";
import { Button } from "../../components/buttons/button";
import { BsThreeDotsVertical } from "react-icons/bs";

export const FriendRequestTab = () => {
    const { isSuccess, isFetching, data} = useGetReceivedFriendRequestsQuery({
        pageNum: 0,
        pageSize: 15
    })

    const [requests, setRequests] = useState<UserFriend[]>([]);

    useEffect(() => {
        if(isSuccess) {
            setRequests(data.data!.list);
        }
    }, [ isSuccess ])

    return (<div className="h-full">
        {isFetching 
            ? <div>isFetching</div>
            : (
                requests.length == 0 
                ? <div className="max-w-80 mx-auto flex h-full items-center flex-col justify-center gap-6">
                    {/* <img src={emptyImage}/> */}
                    <p className="font-medium text-lg">You have no friends now</p>
                </div>
                : <ul className="flex flex-col gap-2">
                    {
                        requests.map(request => (
                            <li key={request.relatedUser.id}>
                                <NavLink to={`/users/${request.relatedUser.id}`}>
                                    <div className="w-full flex gap-4 py-3 px-4 rounded-2xl hover:bg-background-hover">
                                        <Avatar src={request.relatedUser.avatar} />
                                        <div>
                                            <p>{request.relatedUser.name}</p>
                                            <span className="text-sky-400 text-sm font-semibold">@{request.relatedUser.username}</span>
                                        </div>
                                        <div className="ml-auto flex items-center gap-4">
                                            <Button className="flex-grow-0 py-2">
                                                Accept
                                            </Button>
                                            <Button variant="ghost" size="icon" >
                                                <BsThreeDotsVertical />
                                            </Button>
                                        </div>
                                    </div>
                                </NavLink>
                            </li>
                        ))
                    }
                </ul>
            )}
    </div>)
}