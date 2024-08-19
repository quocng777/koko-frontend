import { useDispatch, useSelector } from "react-redux";
import { Conservation, Participant } from "../../app/api/conservation/conservation-type";
import { Avatar } from "../../components/avatar";
import { RootState } from "../../app/api/store";
import { ChangeEvent, Dispatch, forwardRef, KeyboardEvent, MouseEventHandler, TextareaHTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import { useLazyGetMessagesQuery, useSendMessageMutation } from "../../app/api/message/message-api-slice";
import { addLocalMessage, addMessage, addMessages, deleteLocalMessage } from "../../app/api/message/message-slice";
import { Attachment, Message, MessageSendParams, MessageType } from "../../app/api/message/message-type";
import { ApiPaging } from "../../app/api/base/type";
import { getCurrentAuthentication } from "../../app/api/auth/auth-slice";
import { Button } from "../../components/buttons/button";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiKiss } from "react-icons/bs";
import { LuSendHorizonal } from "react-icons/lu";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { updateLatestMsg } from "../../app/api/conservation/conservation-slice";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import { FaFileAlt } from "react-icons/fa";
import { MessageItem } from "./message-item";
import { useSendMessage } from "../../hook/send-message";

export type AttachmentInput = Attachment & {
    file: File,
    type: string,
}

const ChatBox = ({conservation} : {conservation: Conservation}) => {

    const [ attachmentsInput, setAttachmentInput ] = useState<AttachmentInput[]>([])
    const [ showEmojiPicker, setShowEmojiPicker ] = useState(false);

    const textInputRef = useRef<HTMLTextAreaElement | null>(null);
    const dummyBottomRef = useRef<HTMLDivElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const [ loadedFull, setLoadedFull ] = useState(false);
    const [ getMessages ] = useLazyGetMessagesQuery();
    const dispatch = useDispatch();
    const [ haveSubmited, setHasSubmited ] = useState(false);

    // const [ sendMessage ] = useSendMessageMutation();

    const messages = useSelector((state: RootState) => state.message[conservation.id]) || [];

    const sendMessage = useSendMessage({ conservation });

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

        if(text.trim()) {
            // const localMessage: Message = {
            //     id: null,
            //     conservation: conservation.id,
            //     sender: user.id,
            //     message: text,
            //     createdAt: new Date().toISOString(),
            //     type: MessageType.TEXT,
            //     attachments: [],
            //     hasError: false,
            //     tempId: new Date().toString(),
            // };
    
            // dispatch(addLocalMessage(localMessage));
            // dispatch(updateLatestMsg(localMessage));
            // setHasSubmited(true);
    
            // const rq: MessageSendParams = {
            //     conservation: conservation.id,
            //     message: text,
            //     type: MessageType.TEXT
            // };
    
            // sendMessage(rq).unwrap()
            // .then((res) => {
            //     const data = res.data as Message;
            //     dispatch(deleteLocalMessage({conservation: conservation.id, tempId: localMessage.tempId as string}));
            //     dispatch(addMessage(data));
            // }).catch(() => {
            //     localMessage.hasError = true;
            // })
            sendMessage({ messageType: MessageType.TEXT, text, attachments: []});
        }

        if(attachmentsInput.length != 0) {
            // handle send images
            const images = attachmentsInput.filter(atm => atm.type === 'image');
            sendMessage({ messageType: MessageType.IMAGE, attachments: images })
        }

        setTimeout(() => {
            setHasSubmited(true);
        }, 150);

        setAttachmentInput([]);

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
        <div className="bg-background rounded-2xl px-8 h-full overflow-hidden flex flex-col relative">
            <ChatBoxHeader conservation={conservation}/>
            <div ref={messageContainerRef} className="mb-4 overflow-y-scroll h-full flex items-end">
                <ul className="flex flex-col gap-1 max-h-full w-full">
                    {(() => {
                    let prevMessage: Message | null = null;
            
                    return sortedMessages
                    .map(msg => {
                        const prev = prevMessage;
                        prevMessage = msg;
                        const latestMessage = sortedMessages[sortedMessages.length - 1];
                        const isLatest = msg == latestMessage;

                        return <li key={msg.id || msg.tempId}>
                            <MessageItem 
                                message={msg}
                                prevMessage={prev}
                                conservation={conservation}
                                isLatestMessage={isLatest}
                            />
                        </li>
                    })}
                )()}
                </ul>
                <div ref={dummyBottomRef}></div>
            </div>
            { showEmojiPicker && <div className="absolute bottom-16 z-10">
                <EmojiPicker
                className="rounded-3xl" 
                lazyLoadEmojis
                onEmojiClick={handleEmojiPick}
                searchDisabled
                emojiStyle={EmojiStyle.NATIVE}
                previewConfig={{showPreview: false}}
                height={340}
             />
            </div> }
            <MessageInput ref={textInputRef} attachments={attachmentsInput} setAttachments={setAttachmentInput}  onSubmit={onSubmit} onEmojiBtnClick={handleEmojiBtnToggle}/>
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
    attachments: AttachmentInput[],
    setAttachments: Dispatch<React.SetStateAction<AttachmentInput[]>>
    onSubmit: () => void
    onEmojiBtnClick: MouseEventHandler<HTMLButtonElement>
}

const MessageInput = forwardRef<HTMLTextAreaElement,
MessageInputProps>(({ attachments, setAttachments, onSubmit, onEmojiBtnClick }: MessageInputProps, ref) => {

    const fileInputRef = useRef<null | HTMLInputElement>(null);

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
            if(event.key === "Enter") {
                event.preventDefault();
                onSubmit();
            }
        }
    
    const handleFileBtnClick = () => {
        fileInputRef!.current?.click();
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if(files) {

            // transform input file to Attachment inputs
            const newAttachments = Array.from(files).map(( file ): AttachmentInput => {
                // get type of attachment
                let blob = new Blob( [file], {type: file.type});
                let url = URL.createObjectURL(blob);
                let type;
                if (file.type.startsWith('image'))
                    type = 'image';
                else if (file.type.startsWith('audio'))
                    type = 'audio';
                else if (file.type.startsWith('video'))
                    type = 'video';
                else
                    type = 'file';

                return {
                    id: new Date().getTime(),
                    fileName: file.name,
                    type,
                    file,
                    url: url,
                    createdAt: new Date().toISOString()
                }
            })

            setAttachments((prevState) => [...prevState, ...newAttachments])
        }
    }

    return (<div className="sticky bottom-0 left-0 bg-background py-3">
       {
            attachments.length != 0 && <div className="absolute bg-background-active w-full h-24 -top-[110%] rounded-xl flex items-center gap-2 px-4 overflow-x-scroll">
            {attachments.map(atm => {
                if(atm.type === 'image')
                    return (
                        <div key={atm.id} className="rounded-lg overflow-hidden shrink-0">
                            <img src={atm.url!} className="object-contain max-h-14"/>
                        </div>
                )
                else if (atm.type == 'video')
                    return (
                        <div key={atm.id} className="max-w-24 max-h-14 rounded-lg overflow-hidden shrink-0">
                            <video src={atm.url!} />
                        </div>
                )
                else if (atm.type == 'file')
                    return (
                        <div className="w-32 h-10 py-2 px-1.5 bg-violet-500 rounded-lg flex items-center gap-1">
                            <FaFileAlt className="shrink-0" />
                            <p className="text-sm font-medium text-nowrap text-ellipsis  overflow-hidden">{atm.fileName}</p>
                        </div>
                )
            })}
        </div>
       }
        <div className="bg-inherit border-primary border rounded-3xl flex items-center">
            <div className="flex px-2">
                <input type="file" hidden ref={ fileInputRef } onChange={handleFileChange} />
                <Button variant="ghost" size="icon" className="size-8" onClick={handleFileBtnClick}>
                    <CiImageOn />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" onClick={onEmojiBtnClick}>
                    <BsEmojiKiss />
                </Button>
                <Button variant="ghost" size="icon" className="size-8">
                    <MdOutlineKeyboardVoice />
                </Button>
            </div>
            <textarea ref={ref} rows={1} className="w-full resize-none py-2 focus:outline-none bg-inherit" placeholder="Send a message" onKeyDown={handleKeyDown}/>
            <div>
                <Button variant="ghost" size="icon" className="size-8 mx-2" onClick={onSubmit}>
                    <LuSendHorizonal />
                </Button>
            </div>
        </div>
    </div>)
})
export default ChatBox;
