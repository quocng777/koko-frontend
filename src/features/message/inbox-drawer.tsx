import { useSelector } from 'react-redux'
import { getConservations } from '../../app/api/conservation/conservation-slice'
import { Avatar } from '../../components/avatar';
import { Conservation } from '../../app/api/conservation/conservation-type';
import { useMemo } from 'react';

export type InboxDrawerProps = {
    selected?: number,
    onChange: (conservation: Conservation) => void;
}

const InboxDrawer = ( { selected, onChange } : InboxDrawerProps ) => {
    const conservations = useSelector(getConservations);
    const sortedConservations = useMemo(() => {
        return [...conservations].sort((c1, c2) => {
            if(!c1.createdAt && c2.createdAt)
                return 1;
            else if(c1.createdAt || c2.createdAt)
                return -1
            else return new Date(c2.lastMessage!.createdAt).getTime() - new Date(c1.lastMessage!.createdAt).getTime() ?? 0
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
                        <p className='text-xs font-normal'>{conservation.lastMessage && (conservation.lastMessage?.message || 'Sent an attachment')}</p>
                    </div>
                </div>
        </div>
    )
}

export default InboxDrawer