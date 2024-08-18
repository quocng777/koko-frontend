import { useDispatch, useSelector } from "react-redux";
import { Conservation, Participant } from "../../app/api/conservation/conservation-type";
import { Avatar } from "../../components/avatar";
import { RootState } from "../../app/api/store";
import { Dispatch, forwardRef, MouseEventHandler, TextareaHTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import { useLazyGetMessagesQuery, useSendMessageMutation } from "../../app/api/message/message-api-slice";
import { addLocalMessage, addMessage, addMessages, deleteLocalMessage } from "../../app/api/message/message-slice";
import { Message, MessageSendParams, MessageType } from "../../app/api/message/message-type";
import { ApiPaging } from "../../app/api/base/type";
import { getCurrentAuthentication } from "../../app/api/auth/auth-slice";
import { Button } from "../../components/buttons/button";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiKiss } from "react-icons/bs";
import { LuSendHorizonal } from "react-icons/lu";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { updateLatestMsg } from "../../app/api/conservation/conservation-slice";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";

type AttachmentInput = {
    fileName: string,
    data: string,
    uploadedId: number | null
}

type InputValues = {
    text: string,
    image: AttachmentInput[],
}

const initialState: InputValues = {
    text: '',
    image: []
};



const ChatBox = ({conservation} : {conservation: Conservation}) => {

    const [ inputValues, setInputValues ] = useState(initialState);
    const [ showEmojiPicker, setShowEmojiPicker ] = useState(false);

    const textInputRef = useRef<HTMLTextAreaElement | null>(null);
    const dummyBottomRef = useRef<HTMLDivElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const user = useSelector(getCurrentAuthentication);
    const [ loadedFull, setLoadedFull ] = useState(false);
    const [ getMessages ] = useLazyGetMessagesQuery();
    const dispatch = useDispatch();
    const [ haveSubmited, setHasSubmited ] = useState(false);

    const [ sendMessage ] = useSendMessageMutation();

    const messages = useSelector((state: RootState) => state.message[conservation.id]) || [];

    const sortedMessages = useMemo(() => {
        return [...messages].filter((message) => message.conservation == conservation.id).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }, [messages])

    useEffect(() => {
        if(!loadedFull && messages.length <= 1) {
            let oldestMsg = messages[0];
            getMessages({conservationId: conservation.id, pageNum: 0, pageSize: 10, beforeMessage: oldestMsg.id as number })
            .unwrap()
            .then(api => {
                let data = api.data as ApiPaging<Message>;
                if(data.list.length == 0) {
                    setLoadedFull(true)
                    return;
                }
                if(data?.pageNum || 0 >= (data?.totalPages || 0)) {
                    setLoadedFull(true);
                }
                dispatch(addMessages(data?.list as Message[]));
            })
    }}, [])

    const onSubmit = () => {
        const text = textInputRef.current?.value as string
        if(textInputRef.current) {
            textInputRef.current.value = '';
        }
        const localMessage: Message = {
            id: null,
            conservation: conservation.id,
            sender: user.id,
            message: text,
            createdAt: new Date().toISOString(),
            type: MessageType.TEXT,
            attachments: [],
            hasError: false,
            tempId: new Date().toString(),
        };

        dispatch(addLocalMessage(localMessage));
        dispatch(updateLatestMsg(localMessage));
        setHasSubmited(true);

        const rq: MessageSendParams = {
            conservation: conservation.id,
            message: text,
            type: MessageType.TEXT
        };

        sendMessage(rq).unwrap()
        .then((res) => {
            const data = res.data as Message;
            dispatch(deleteLocalMessage({conservation: conservation.id, tempId: localMessage.tempId as string}));
            dispatch(addMessage(data));
        }).catch(() => {
            localMessage.hasError = true;
        })


    }

    const scrollToNewestMessage = () => {
        if(dummyBottomRef.current) {
            dummyBottomRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const handleEmojiPick = (e: EmojiClickData) => {
        textInputRef.current!.value += e.emoji;
    }

    const handleEmojiBtnToggle = () => {
        setShowEmojiPicker((state) => !state);
    }

    useEffect(() => {
        if(haveSubmited == true) {
            scrollToNewestMessage();
            setHasSubmited(false);
        }
    }, [haveSubmited]);

    useEffect(() => {
    if (messageContainerRef.current) {
        const container = messageContainerRef.current;
        container.scrollTop = container.scrollHeight - container.clientHeight;
      }}, [])

  return (
    <div className="py-8 px-6 min-h-screen w-full relative max-h-screen">
        <div className="bg-background rounded-2xl px-8 h-full overflow-hidden flex flex-col">
            <ChatBoxHeader conservation={conservation}/>
            <div ref={messageContainerRef} className="mb-4 overflow-y-scroll h-full flex items-end">
                <ul className="flex flex-col gap-1 max-h-full w-full">
                    {(() => {
                    let lastTime: number;
                    let lastUser: number;
            
                    return sortedMessages
                    .map(msg => {
                        let isMe = false;
                        let showUserInfo = false;
                        let createdAt = new Date(msg.createdAt);
                        createdAt.setSeconds(0);
                        createdAt.setMilliseconds(0);
                        let sender = conservation.participants.find((participant) =>participant.userId == msg.sender) as Participant
                        let timeString = createdAt.toLocaleString('en-US', {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true});

                        if(createdAt.getTime() != lastTime) {
                            showUserInfo = true;
                            lastTime = createdAt.getTime();
                        }

                        if(lastUser != msg.sender) {
                            showUserInfo = true;
                            lastUser = msg.sender;
                        }

                        if(user.id == msg.sender) {
                            isMe = true;
                        }

                        return (<li key={msg.id || msg.tempId} className="grid justify-items-start">
                            <div className={`${isMe ? 'justify-self-end' : ''}`}>
                                {showUserInfo && <div className="py-1.5"></div>}
                                <div className="w-full flex gap-2">
                                    {!isMe && <div className="w-9">
                                        {showUserInfo && <Avatar size="sm" src={sender.userAvatar}/>}
                                    </div>}
                                    <div className={`${isMe ? 'grid justify-items-end' : ''}`}>
                                        {showUserInfo && 
                                            <div className="text-xs font-medium flex gap-3 my-1">
                                                {!isMe && <p>{sender.name}</p>}
                                                <p className="text-slate-500">{timeString}</p>
                                            </div>}
                                            <div className={`${!isMe ? 'bg-sky-500 text-white': 'bg-slate-600 text-white'}  py-1.5 px-4 rounded-3xl w-fit max-w-48`}>
                                                {msg.message}
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </li>)
                    })}
                )()}
                </ul>
                <div ref={dummyBottomRef}></div>
            </div>
            { showEmojiPicker && <div className="absolute bottom-10">
                <EmojiPicker
                className="rounded-3xl" 
                lazyLoadEmojis
                onEmojiClick={handleEmojiPick}
                searchDisabled
                emojiStyle={EmojiStyle.NATIVE}
                previewConfig={{showPreview: false}}
                height={400}
             />
            </div> }
            <MessageInput ref={textInputRef} input={inputValues} setInput={setInputValues} onSubmit={onSubmit} onEmojiBtnClick={handleEmojiBtnToggle}/>
        </div>
    </div>
  )
}

const ChatBoxHeader = ({conservation}: {conservation: Conservation}) => {

    return (
        <div className="bg-background py-2 flex sticky bottom-0 left-0">
            <Avatar size="md" src={conservation.avatar}/>
            <div className="flex-1 flex items-center ms-3">
                <p className="text-lg font-semibold">{conservation.name}</p>
            </div>
        </div>
    )

}

export type MessageInputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    input: InputValues,
    setInput: Dispatch<React.SetStateAction<InputValues>>
    onSubmit: () => void
    onEmojiBtnClick: MouseEventHandler<HTMLButtonElement>
}

const MessageInput = forwardRef<HTMLTextAreaElement,
MessageInputProps>(({ input, setInput, onSubmit, onEmojiBtnClick }: MessageInputProps, ref) => {

    return (<div className="sticky bottom-0 left-0 bg-background py-3">
        <div className="bg-inherit border-primary border rounded-3xl flex items-center">
        <div className="flex px-2">
            <Button variant="ghost" size="icon" className="size-8">
                <CiImageOn />
            </Button>
            <Button variant="ghost" size="icon" className="size-8" onClick={onEmojiBtnClick}>
                <BsEmojiKiss />
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
                <MdOutlineKeyboardVoice />
            </Button>
        </div>
        <textarea ref={ref} rows={1} className="w-full resize-none py-2 focus:outline-none bg-inherit" placeholder="Send a message"/>
        <div>
            <Button variant="ghost" size="icon" className="size-8 mx-2" onClick={onSubmit}>
                <LuSendHorizonal />
            </Button>
        </div>
    </div>
    </div>)
})
export default ChatBox;