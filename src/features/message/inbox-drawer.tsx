import { useSelector } from 'react-redux'
import { getConservations } from '../../app/api/conservation/conservation-slice'
import { Avatar } from '../../components/avatar';
import { Conservation } from '../../app/api/conservation/conservation-type';
import { useMemo } from 'react';
import { Message, MessageType } from '../../app/api/message/message-type';

export type InboxDrawerProps = {
    selected?: number,
    onChange: (conservation: Conservation) => void;
}

const InboxDrawer = ( { selected, onChange } : InboxDrawerProps ) => {
    const conservations = useSelector(getConservations);
    const sortedConservations = useMemo(() => {
        return [...conservations].sort((c1, c2) => {
            if(!c1.lastMessage && !c2.lastMessage)
                return 1;
            else if(!c1.lastMessage || !c2.lastMessage)
                return c1.lastMessage ? -1 : 1;
            else return new Date(c2.lastMessage!.createdAt).getTime() - new Date(c1.lastMessage!.createdAt).getTime()
        });
    }, [ conservations ])
    // 


  return (
    <div className='py-8 h-full'>
        <div className='bg-background h-full rounded-2xl px-2 py-4 shadow-sm lg:min-w-96 transition-all'>
            <h4 className='text-lg mb-4 ms-4 max-lg:hidden'>Messages</h4>

            <div className='flex gap-1 flex-col'>
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
        </div>
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
                        <p className='text-xs font-normal'>{getLastMessage(conservation.lastMessage)}</p>
                    </div>
                    { (conservation.unread) > 0 &&
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

export default InboxDrawer