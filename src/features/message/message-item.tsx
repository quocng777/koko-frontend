import { forwardRef, useMemo } from 'react'
import { Conservation, Participant } from '../../app/api/conservation/conservation-type'
import { Message, MessageType } from '../../app/api/message/message-type'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentAuthentication } from '../../app/api/auth/auth-slice'
import { Avatar } from '../../components/avatar'
import { FaFile } from "react-icons/fa6";
import { Button } from '../../components/buttons/button'
import { MdDeleteOutline } from "react-icons/md";
import { useUnSendMessageMutation } from '../../app/api/message/message-api-slice'
import { updateDeletedMessage } from '../../app/api/message/message-slice'

export type MessageItemProps = {
    message: Message,
    prevMessage?: Message | null,
    conservation: Conservation,
    isLatestMessage?: boolean
}

type MessageMetaData = {
    isMe: boolean,
    showUserInfo: boolean,
    formattedCreatedAt: string,
    sender: Participant,
}

export const MessageItem = forwardRef<HTMLDivElement, MessageItemProps>(({ message, prevMessage, conservation, isLatestMessage }, ref) => {

    const user = useSelector(getCurrentAuthentication);
    const dispatch = useDispatch();
    const sender = useMemo(() => {
        const user = conservation.participants.find(mem => mem.userId === message.sender)!;
        return user;
    }, [ conservation, message])

    const metaData = useMemo((): MessageMetaData => {
        let isMe = false;
        let showUserInfo = false;
        let createdAt = new Date(message.createdAt);
        createdAt.setSeconds(0);
        createdAt.setMilliseconds(0);
        let prevCreatedAt = !prevMessage ? null : new Date(prevMessage.createdAt);
        if(prevCreatedAt) {
            prevCreatedAt.setSeconds(0);
            prevCreatedAt.setMilliseconds(0);
        }

        let sender = conservation.participants.find         ((participant) =>participant.userId == message.sender) as Participant
        let timeString = createdAt.toLocaleString('en-US', {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true});

        if(!prevCreatedAt || createdAt.getTime() != prevCreatedAt.getTime()) 
            showUserInfo = true;

        if(prevMessage?.sender !=  message.sender)
            showUserInfo = true;
        
        if(user.id == message.sender) {
            isMe = true;
        }

        return {
            isMe,
            showUserInfo,
            formattedCreatedAt: timeString,
            sender
        }

    }, [message, prevMessage, conservation]);

    const [ unSendMessage ] = useUnSendMessageMutation();

    const handleUnsendMessageClick = () => {
        unSendMessage(message.id!);
        dispatch(updateDeletedMessage({
            conservationId: message.conservation,
            messageId: message.id!,
            deletedAt: new Date().toISOString()
        }))
    }

  return (
    <div className='w-full grid group/item' ref={ref}>
        <div 
        className={`${metaData.isMe ? 'justify-self-end' : ''}`}>
            {metaData.showUserInfo && <div className="py-1.5"></div>}
            <div className="w-full flex gap-2">
                {!metaData.isMe && 
                <div className="w-9">
                    {metaData.showUserInfo && <Avatar size="sm" src={metaData.sender.userAvatar}/>}
                </div>}
                <div className={`${metaData.isMe ? 'grid justify-items-end' : ''}`}>
                    {metaData.showUserInfo && 
                        <div className="text-xs font-medium flex gap-3 my-1">
                            {!metaData.isMe && <p>{metaData.sender.name}</p>}
                            <p className="text-slate-500 pr-2">{metaData.formattedCreatedAt}</p>
                        </div>}
                    <div className='flex items-center gap-6'>
                        <div className={`${metaData.isMe ? 'order-2' : 'order-1'}`}>
                            <MessageContent message={ message } isMe={ metaData.isMe } senderName={ sender.name }/>
                        </div>
                        {
                            message.id && message.type !== MessageType.DELETED && <div className={`opacity-0 group-hover/item:opacity-100 ${metaData.isMe ? 'order-1' : 'order-2'} transition-opacity duration-300`}>
                            {metaData.isMe && <Button variant='ghost' size='icon'  className={`size-8 shrink-0 hover:text-red-500`}
                            onClick={handleUnsendMessageClick}>
                                <MdDeleteOutline />
                            </Button>}
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
        {/* show message sending status */}
            {
                isLatestMessage && metaData.isMe 
                && (<MessageSendingStatus message={message}/>) 
            }
            {
                !isLatestMessage && metaData.isMe 
                && (<MessageSendingStatus message={message} unShowIfSent={true}/>) 
            }
    </div>
  );
})

const MessageSendingStatus = ({message, unShowIfSent = false}: {message: Message, unShowIfSent?: boolean}) => {
    let messageStatus;
    if(message.tempId) {
        messageStatus = 'Sending';
    } else if (message.hasError) {
        messageStatus = 'Error';
    } else if (message.seenBy && message.seenBy.length > 0) {
        messageStatus = 'Seen';
    } else 
        messageStatus = 'Sent'
    
    if( !message.tempId && unShowIfSent  )
        return null

    return <div className='flex justify-end'>
        <span className={`text-xs font-medium px-2.5 ${message.hasError ? 'text-red-500' : ''}`}>{messageStatus}</span>
    </div>
}


// element to show the content of a message
const MessageContent = ( { message, isMe, senderName } : { message: Message, isMe?: boolean, senderName: string } ) => {
    if ( message.type == MessageType.TEXT || message.type == MessageType.DELETED ) {
        return (
            <div className={`${!isMe ? 'bg-sky-500 text-white': 'bg-slate-600 text-white'}  py-1.5 px-4 rounded-3xl w-fit max-w-64 text-wrap`}>
                {
                    message.type == MessageType.TEXT ?
                    <p className='break-all'>
                    {message.message}
                    </p> :
                    <p className='break-all italic'>
                    {isMe ? 'You deleted this message' : `${senderName + ' deleted this message'}`}
                    </p> 
                }
            </div>
        )
    } else if (message.type == MessageType.IMAGE ) {
        if (message.attachments.length == 1) {
            return (
                <div className='rounded-lg overflow-hidden max-w-64'>
                    <img src={message.attachments[0].url} className='object-contain'/>
                </div>
            )
        }
    } else if ( message.type == MessageType.FILE ) {
        return (
            <a href={message.attachments[0]?.url} target='_blank'>
                <div className={`${!isMe ? 'bg-sky-500 text-white': 'bg-slate-600 text-white'}  py-1.5 px-4 rounded-3xl w-fit max-w-64 flex items-center gap-2.5`}>
                    <FaFile />
                    <span className='overflow-hidden text-ellipsis'>{ message.attachments[0].fileName }</span>
                </div>
            </a>
            
        )
    } else if (message.type == MessageType.VIDEO ) {
        return (
            <div className='rounded-lg overflow-hidden max-w-64'>
                <video controls>
                    <source src={message.attachments[0]?.url}/>
                    This video can't play now
                </video>
            </div>
        )
    }
}
