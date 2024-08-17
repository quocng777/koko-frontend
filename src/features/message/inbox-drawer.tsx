import { useSelector } from 'react-redux'
import { getConservations } from '../../app/api/conservation/conservation-slice'
import { Avatar } from '../../components/avatar';
import { Conservation } from '../../app/api/conservation/conservation-type';

const InboxDrawer = () => {
    const conservations = useSelector(getConservations);
    const sortedConservations = [...conservations].sort((c1, c2) => (c1.lastMessage?.id || 0) - (c2.lastMessage?.id || 0));


  return (
    <div className='py-8 h-full'>
        <div className='bg-background h-full rounded-2xl px-2 py-4 shadow-sm lg:min-w-96'>
            <h4 className='text-lg mb-4 ms-4 max-lg:hidden'>Messages</h4>

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
    return (
        <div className='rounded-xl transition-all hover:bg-background-hover px-4 py-4 cursor-pointer'>
                <div className='flex gap-3 items-center'>
                    <Avatar size='sm' src={conservation.avatar}/>
                    <div className='max-lg:hidden'>
                        <p className='font-medium'>{conservation.name}</p>
                        <p className='text-xs font-normal'>{conservation.lastMessage?.message}</p>
                    </div>
                </div>
        </div>
    )
}

export default InboxDrawer