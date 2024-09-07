import { ChangeEventHandler, useCallback, useRef, useState } from "react"
import { Input } from "../../components/form/Input"
import { ModalBody, ModalFooter, ModalHeader, ModalRoot } from "../../components/modal/modal"
import { UserContact } from "../../app/api/user/user-type"
import { useLazyGetFriendsQuery } from "../../app/api/user/user-api-slice"
import { Avatar } from "../../components/avatar"
import { Button } from "../../components/buttons/button"
import { IoCloseOutline } from "react-icons/io5"
import { Conservation, ConservationParams, ConservationType } from "../../app/api/conservation/conservation-type"
import { useSelector } from "react-redux"
import { getCurrentAuthentication } from "../../app/api/auth/auth-slice"
import { useCreateConservationMutation } from "../../app/api/conservation/conservation-api-slice"

type CreateGroupModal = {
    onClose: () => void,
    onSuccess: (conservation: Conservation) => void
}

export const CreateGroupModal = ({ onClose, onSuccess }: CreateGroupModal) => {

    const [ members, setMembers ] = useState<UserContact[]>([]);
    const [ searchedUsers, setSearchedUsers ] = useState<UserContact[]>([]); 
    const [ showSearchList, setShowSearchList ] = useState(false);
    const [ name, setName ] = useState('');
    const user = useSelector(getCurrentAuthentication);
    const [ createConservation ] = useCreateConservationMutation()

    const searchFriendRef = useRef<HTMLInputElement| null>(null);
    const [ getFriends ] = useLazyGetFriendsQuery();
    
    const handleSearchUserClick = useCallback((user: UserContact) => {
        setSearchedUsers([]);
        setShowSearchList(false);
        searchFriendRef.current!.value = '';
        setMembers((prev) => {
            const idx = prev.findIndex((mem) => mem.id === user.id)
            if(idx == -1) 
                return [ ...prev, user ];

            return prev;
        })
    }, []);

    const handleUserRemove = useCallback((user: UserContact) => {
        setMembers((prev) => {
            return prev.filter(mem => mem.id !== user.id);
        })
    }, [])

    const handleSearchFriendChange = () => {
        const value = searchFriendRef.current!.value;

        if(value.trim() == '') {
            setSearchedUsers([]);
            setShowSearchList(false);
            return;
        }
        if(!showSearchList) {
            setShowSearchList(true);
        }
        
        getFriends({
            pageSize: 10,
            pageNum: 0,
            keyword: value
        }).unwrap()
        .then(res => {
            setSearchedUsers(res.data!.list);
        })

    }

    const handleNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setName(event.target.value);
    }

    const handleSubmit = () => {
        if(members.length <= 0) {
            alert('Please add member to this group');
            return;
        }

        if(name.trim() == '') {
            alert('Please name the group');
            return;
        }

        const participants = members.map(mem => mem.id);
        participants.push(user.id);

        const rq: ConservationParams = {
            name,
            participants,
            type: ConservationType.GROUP
        }

        createConservation(rq)
            .unwrap()
            .then(res => {
                const conservation = res.data!;
                onSuccess(conservation);
            })
            .catch(() => {
                alert('Have error when create this group')
            })


    }

    return (
        <ModalRoot onClose={onClose} >
            <ModalHeader title="Create a group" className="mb-4" />
            <ModalBody>
                <div className="w-full max-h-96 h-96 min-h-60 ">
                    <Input className="w-full py-2 rounded-3xl" placeholder="Group name" required value={name} onChange={handleNameChange} />
                    <p className="text-sm text-sky-500 font-medium my-1 mt-2 px-2">Add friends</p>
                    <Input className="rounded-3xl w-full" placeholder="Find friend" onChange={handleSearchFriendChange} ref={searchFriendRef}/>

                    <div className="overflow-y-auto h-full mt-2 py-2">
                        {
                            showSearchList
                            ? searchedUsers.map((user) => (
                                <SearchedFriendItem key={user.id}  user={user} onClick={handleSearchUserClick}/>
                            ))
                            : members.map((user) => (
                                <SelectedFriend 
                                    key={user.id} 
                                    user={user}
                                    onRemove={handleUserRemove}
                                />
                            ))
                        }
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button className="rounded-3xl px-12" onClick={handleSubmit}>
                    Next
                </Button>
            </ModalFooter>
        </ModalRoot>
    )
}

type SearchedFriendItemProps = {
    user: UserContact,
    onClick: (user: UserContact) => void,
}

const SearchedFriendItem = ({ user, onClick }: SearchedFriendItemProps) => {

    const handleClick = () => {
        onClick(user);
    }

    return (
        <div className="py-3 px-4 flex gap-4 items-center hover:bg-background-hover rounded-2xl cursor-pointer transition-all" onClick={ handleClick }>
            <Avatar src={user.avatar}/>
            <div>
                <p className="text-slate-600">{user.name}</p>
                <p className="text-sm font-medium text-sky-500">@{user.username}</p>
            </div>
        </div>
    )
}

type SelectedFriendProps = {
    user: UserContact,
    onRemove: (user: UserContact) => void
}
const SelectedFriend = ({ user, onRemove }: SelectedFriendProps) => {

    const handleUserRemoveClick = () => {
        onRemove(user);
    }

    return (
        <div className="inline-block mr-1">
            <div className="py-2 px-4 rounded-3xl w-fit border border-sky-500 flex gap-2 bg-slate-200 items-center">
                <Avatar size="xs" />
                <p className="font-semibold text-slate-600">{user.name}</p>
                <Button variant="ghost" size="icon" className="size-6 text-sky-600" onClick={handleUserRemoveClick}>
                    <IoCloseOutline />
                </Button>
            </div>
        </div>
    )
}