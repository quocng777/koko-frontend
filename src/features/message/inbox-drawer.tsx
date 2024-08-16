import { useSelector } from 'react-redux'
import { getConservations } from '../../app/api/conservation/conservation-slice'
import { Avatar } from '../../components/avatar';
import { Conservation } from '../../app/api/conservation/conservation-type';
import { getMessage } from '../../app/api/message/message-slice';
import { RootState } from '../../app/api/store';

const InboxDrawer = () => {
    const conservations = useSelector(getConservations);
    const sortedConservations = [...conservations].sort((c1, c2) => (c1.lastMessageAt?.getTime() || 0) - (c2.lastMessageAt?.getTime() || 0));


  return (
    <div className='py-8 h-full'>
        <div className='bg-background h-full rounded-2xl px-2 py-4'>
            <h4 className='text-lg mb-4 ms-4 max-md:hidden'>Messages</h4>

            <div>
                {
                    sortedConservations.map((conservation) => 
                        <InboxElement key={conservation.id}  conservation={conservation}/>
                    )
                }
            </div>
        </div>
    </div>
  )
}

const InboxElement = ({conservation}: {conservation: Conservation}) => {
    const message = useSelector((state: RootState) => getMessage(state, {consId: conservation.id, msgId: conservation.lastMessage as number}))

    return (
        <div className='rounded-xl transition-all hover:bg-background-hover px-4 py-4 cursor-pointer'>
                <div className='flex gap-3 items-center'>
                    <Avatar size='sm' src={conservation.avatar}/>
                    <div className='min-w-48 max-md:hidden'>
                        <p className='font-medium'>{conservation.name}</p>
                        <p className='text-xs font-normal'>{message?.message}</p>
                    </div>
                </div>
        </div>
    )
}

export default InboxDrawer