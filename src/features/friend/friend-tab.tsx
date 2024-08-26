import { useEffect, useState } from "react"
import { useGetFriendsQuery } from "../../app/api/user/user-api-slice"
import { UserContact } from "../../app/api/user/user-type"
import emptyImage from '../../assets/empty_street_image.svg'
import { NavLink } from "react-router-dom"
import { Avatar } from "../../components/avatar"
import { Button } from "../../components/buttons/button"
import { BsThreeDotsVertical } from "react-icons/bs";

export const FriendTab = () => {
    const { isSuccess, isFetching, data} = useGetFriendsQuery({
        pageNum: 0,
        pageSize: 15
    })
    const [friends, setFriends] = useState<UserContact[]>([]);

    useEffect(() => {
        if(isSuccess) {
            setFriends(data.data!.list);
        }
    }, [ isSuccess ])

    return (<div className="h-full">
        {isFetching 
            ? <div>isFetching</div>
            : (
                friends.length == 0 
                ? <div className="max-w-80 mx-auto flex h-full items-center flex-col justify-center gap-6">
                    <img src={emptyImage}/>
                    <p className="font-medium text-lg">You have no friends now</p>
                </div>
                : <ul className="flex flex-col gap-2">
                    {
                        friends.map(friend => (
                            <li key={friend.id}>
                                <NavLink to={`/users/${friend.username}`}>
                                    <div className="w-full flex gap-4 py-3 px-4 rounded-2xl hover:bg-background-hover">
                                        <Avatar src={friend.avatar} />
                                        <div>
                                            <p>{friend.name}</p>
                                            <span className="text-sky-400 text-sm font-semibold">@{friend.username}</span>
                                        </div>
                                        <div className="ml-auto flex items-center gap-4">
                                            <Button className="flex-grow-0 py-2">
                                                Message
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