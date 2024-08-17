import { useSelector } from 'react-redux'
import { Conservation } from '../../app/api/conservation/conservation-type'
import ChatBox from './chat-box'
import InboxDrawer from './inbox-drawer'
import { RootState } from '../../app/api/store'

export const MessagePage = () => {
    const conservation = useSelector((state: RootState) => {
        return state.conservation
        .find((conservation) => conservation.id == 12)
    }) as Conservation

    console.log(conservation)

  return (
    <div className='flex w-full'>
        <InboxDrawer />
        {conservation && <ChatBox conservation={conservation}/>}
    </div>
  )
}