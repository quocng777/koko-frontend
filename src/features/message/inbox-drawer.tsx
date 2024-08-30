import { useDispatch, useSelector } from 'react-redux'
import { addConservation, getConservations } from '../../app/api/conservation/conservation-slice'
import { Avatar } from '../../components/avatar';
import { Conservation, ConservationResponse, ConservationType } from '../../app/api/conservation/conservation-type';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Message, MessageType } from '../../app/api/message/message-type';
import { Input } from '../../components/form/Input';
import { useLazyGetConservationQuery, useLazyGetConservationsPagingQuery } from '../../app/api/conservation/conservation-api-slice';
import { NavLink } from 'react-router-dom';
import { getCurrentAuthentication } from '../../app/api/auth/auth-slice';
import { IoArrowBack } from "react-icons/io5";
import { Button } from '../../components/buttons/button';
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { createPortal } from 'react-dom';
import { CreateGroupModal } from './create-group-modal';
import { useEndpoints } from '../../hook/use-endpoints';
import { useSubscribeTopic } from '../../app/api/socket';
import { useLazyGetNumUnreadMsgQuery } from '../../app/api/message/message-api-slice';

export type InboxDrawerProps = {
    selected?: number,
    onChange: (conservation: Conservation) => void;
}

const InboxDrawer = ( { selected, onChange } : InboxDrawerProps ) => {
    const conservations = useSelector(getConservations);
    const [ showSearchList, setShowSearchList ] = useState(false);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const [ searchList, setSearchList ] = useState<ConservationResponse[]>([]);
    const [ getConservationPaging ] = useLazyGetConservationsPagingQuery();
    const [ showCreateGroupModal, setShowCreateGroupModal ] = useState(false);
    const TOPIC_ENDPOINTS = useEndpoints();
    const [ getConservation ] = useLazyGetConservationQuery();
    const [ getUnreadMsgNum ] = useLazyGetNumUnreadMsgQuery();
    const dispatch = useDispatch();

    const sortedConservations = useMemo(() => {
        return [...conservations].sort((c1, c2) => {
            if(!c1.lastMessage && !c2.lastMessage)
                return 1;
            else if(!c1.lastMessage || !c2.lastMessage)
                return c1.lastMessage ? -1 : 1;
            else return new Date(c2.lastMessage!.createdAt).getTime() - new Date(c1.lastMessage!.createdAt).getTime()
        });
    }, [ conservations ])
    

    const handleCloseSearch = () => {
        searchInputRef.current!.value = '';
        setSearchList([]);
        setShowSearchList(false);
    }

    const handleModalCreateGroupClose = useCallback(() => {
        setShowCreateGroupModal(false);
    }, [])

    const handleSearchChange = useCallback(() => {
        if(searchInputRef.current?.value.trim() !== '') {
            const val = searchInputRef.current!.value;
            getConservationPaging({
                pageNum: 0,
                pageSize: 10,
                keyword: val
            }).unwrap()
            .then(res => {
                setSearchList(res.data!.list)
            })
        } else {
            setSearchList([]);
        }
    }, [])

    const handleCreateGroupClick = () => {
        setShowCreateGroupModal(true);
    }

    const handleCreateGroupSuccess = useCallback((conservation: Conservation) => {
        setShowCreateGroupModal(false);
        onChange(conservation);
    }, [])

    useSubscribeTopic(TOPIC_ENDPOINTS.MESSAGE_COME, (message) => {
        const msg = JSON.parse(message.body) as Message;

        console.log(conservations)
        const idx = conservations.findIndex(cons => cons.id == msg.conservation)

        if(idx == -1) {
            getConservation(msg.conservation)
            .unwrap()
            .then(res => {
                const data = res.data!;
                getUnreadMsgNum({conservation: msg.conservation})
                .unwrap()
                .then((res) => {
                    const unread = res.data!;
                    const conservation: Conservation = {
                        ...data,
                        lastMessage: msg,
                        unread,
                    }
                    dispatch(addConservation(conservation))
                })
            })
        }
    }, [ conservations ]);


  return (
    <div className='py-8 h-full'>
        <div className='px-6 bg-background h-full rounded-2xl  py-4 shadow-sm lg:min-w-96 transition-all max-lg:max-w-[5.25rem] overflow-x-auto max-lg:px-2'>
            <div className='flex items-center max-lg:hidden mb-4 ms-4'>
                <h4 className='text-lg max-lg:hidden font-semibold'>Messages</h4>
                <div className='ml-auto'>
                    <Button variant='ghost' size='icon' className='text-sky-400' onClick={handleCreateGroupClick}>
                        <AiOutlineUsergroupAdd />
                    </Button>
                </div>
            </div>

            <div className='flex items-center gap-2 w-full flex-1 mt-2'>
                {
                    showSearchList && <Button 
                    variant='ghost' 
                    size='icon' 
                    className='text-lg hover:text-sky-500 shrink-0'
                    onClick={handleCloseSearch}>
                    <IoArrowBack />
                </Button>
                }
                <div className='flex-1'>
                    <Input className='rounded-3xl py-1.5 w-full' placeholder='Search conservation' 
                    ref={searchInputRef}
                    onChange={handleSearchChange}
                    onClick={() => setShowSearchList(true)}/>
                </div>
            </div>
            
            {
                showSearchList ?
                <div className='mt-4'>
                    {
                        searchList.map(
                            (conservation) => (
                                <SearchConservationItem
                                key={conservation.id}
                                conservation={conservation} onClick={onChange}/>
                            )
                        )
                    }
                </div> : 
                <div className='flex gap-1 flex-col mt-4'>
                {
                    sortedConservations.map((conservation) => 
                        <InboxElement 
                            key={conservation.id}  
                            conservation={conservation} isSelected={conservation.id === selected}
                            onClick={onChange}
                        />
                    )
                }
            </div>
            }
            
        </div>
        {showCreateGroupModal && createPortal(<CreateGroupModal onClose={handleModalCreateGroupClose} onSuccess={handleCreateGroupSuccess}/>, document.body)}
    </div>
  )
}

export type InboxElementProps = {
    conservation: Conservation,
    isSelected?: boolean,
    onClick: (conservation: Conservation) => void
}

const getLastMessage = (message: Message | null): string => {
    if(!message)
        return "";
    else if(message.type == MessageType.TEXT)
        return message.message;
    else if(message.type == MessageType.DELETED)
        return 'Deleted a message';
    else 
        return 'Send a attachment'
}

const InboxElement = ({ conservation, isSelected = false, onClick }: InboxElementProps) => {

    const handleConservationClick = () => {
        onClick(conservation);
    }

    return (
        <div className={`
        rounded-xl transition-all 
        hover:bg-background-hover 
        px-4 py-4 cursor-pointer
        ${isSelected ? 'bg-background-active hover:bg-background-active' : ''}
        `}
        onClick={handleConservationClick}
        >
                <div className='flex gap-3 items-center'>
                    <Avatar size='sm' src={conservation.avatar}/>
                    <div className='max-lg:hidden'>
                        <p className='font-medium'>{conservation.name}</p>
                        <p className='text-xs font-normal'>{getLastMessage(conservation.lastMessage!)}</p>
                    </div>
                    { (conservation.unread!) > 0 &&
                        <div className='flex-1 max-lg:hidden'>
                            <div className='bg-red-500 size-6 rounded-full text-xs font-medium text-white flex items-center justify-center ml-auto'>
                                {conservation.unread}
                        </div>
                    </div>
                    }
                </div>
        </div>
    )
}

const SearchConservationItem = ({ conservation, onClick }: { conservation: ConservationResponse, onClick: (conservation: Conservation) => void }) => {
    const user = useSelector(getCurrentAuthentication);
    const normConservation: Conservation = useMemo(() => {
        if(conservation.type == ConservationType.GROUP)
            return conservation;

        const recipient = conservation
        .participants
        .filter(mem => mem.userId != user.id)![0];

        return {
            ...conservation,
            name: recipient.name,
            avatar: recipient.userAvatar,
        }
    }, [conservation])

    const handleClick = () => {
        onClick(conservation);
    }

    return (<div>
        <NavLink to={`/messages/${conservation.id}`} onClick={handleClick} className='flex py-3 px-8 gap-4 items-center hover:bg-background-hover rounded-xl transition-all'>
            <Avatar size='sm' src={normConservation.avatar}/>
            <p className='font-semibold'>{normConservation.name}</p>
        </NavLink>
    </div>)

}

export default InboxDrawer