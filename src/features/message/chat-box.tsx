import { useDispatch, useSelector } from "react-redux";
import { Conservation, Participant } from "../../app/api/conservation/conservation-type";
import { Avatar } from "../../components/avatar";
import { RootState } from "../../app/api/store";
import { ChangeEvent, Dispatch, forwardRef, KeyboardEvent, MouseEventHandler, MutableRefObject, TextareaHTMLAttributes, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLazyGetMessagesQuery, useLazyUpdateSeenStatusQuery } from "../../app/api/message/message-api-slice";
import { addOldMessages } from "../../app/api/message/message-slice";
import { Attachment, Message, MessageType } from "../../app/api/message/message-type";
import { Button } from "../../components/buttons/button";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiKiss } from "react-icons/bs";
import { LuSendHorizonal } from "react-icons/lu";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import { FaFileAlt } from "react-icons/fa";
import { MessageItem } from "./message-item";
import { useSendMessage } from "../../hook/send-message";
import { MdCancel } from "react-icons/md";
import SimpleSpinner from "../../components/spinner/simple-spinner";
import useSocket, { sendTypingStatus } from "../../app/api/socket";
import { getCurrentAuthentication } from "../../app/api/auth/auth-slice";
import { FaArrowDown } from "react-icons/fa6";
import { useEndpoints } from "../../hook/use-endpoints";

export type AttachmentInput = Attachment & {
    file: File,
    type: string,
}

const getMessageType = (type: string): MessageType | undefined => {
    if(type === 'image')
        return MessageType.IMAGE
    if(type === 'video')
        return MessageType.VIDEO
    if(type === 'file')
        return MessageType.FILE
}

const ChatBox = ({conservation} : {conservation: Conservation}) => {

    const [ attachmentsInput, setAttachmentInput ] = useState<AttachmentInput[]>([])
    const [ showEmojiPicker, setShowEmojiPicker ] = useState(false);

    const textInputRef = useRef<HTMLTextAreaElement | null>(null);
    const dummyBottomRef = useRef<HTMLDivElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const oldestMessageRef = useRef<HTMLLIElement | null>(null);

    const [ getMessages ] = useLazyGetMessagesQuery();
    const dispatch = useDispatch();
    const [ haveSubmitted, setHasSubmitted ] = useState(false);
    const [ isFirstScrolledDown, setIsFirstScrolledDown ] = useState(false);
    const topScrollRef = useRef<null | HTMLDivElement>(null);
    const [ hasOldMessages, setHasOldMessages ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ addedOldMessages, setAddedOldMessages ] = useState(false)
    const { client } = useSocket();
    const [ typingUsers, setTypingUsers ] = useState<Participant[]>([]);
    const user = useSelector(getCurrentAuthentication);
    const latestMessageRef = useRef<HTMLDivElement | null>(null);
    const [ showGoDown, setShowGoDown ] = useState(false);
    const EndPoints = useEndpoints();
    const [ haveNewMsg, setHaveNewMsg ] = useState(false);
    const [ updateSeenStatus ] = useLazyUpdateSeenStatusQuery();

    // const [ sendMessage ] = useSendMessageMutation();

    const messages = useSelector((state: RootState) => state.message[conservation.id]);

    const sendMessage = useSendMessage({ conservation });

    const sortedMessages = useMemo(() => {
        if(messages) {
            return [ ...messages ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }

        return [];
    }, [ messages ])


    const onMessageSent = () => {
       setTimeout(() => { setHasSubmitted(true);}, 100)
    } 

    const onSubmit = () => {
        const attachments = attachmentsInput;
        setAttachmentInput([]);

        const text = textInputRef.current?.value as string
        if(textInputRef.current) {
            textInputRef.current.value = '';
            handleChangeTyping('');
        }

        if(text.trim()) {
            sendMessage({ messageType: MessageType.TEXT, text, attachments: [], onSubmit: onMessageSent});
            
        }

        if(attachments.length != 0) {
            // handle sending images
            const images = attachmentsInput.filter(atm => {
                return atm.type === 'image'
            });
            
            if(images.length > 0) {
                sendMessage({ messageType: MessageType.IMAGE, attachments: images, onSubmit: onMessageSent })
            }

            // handle sending other files
            attachments
                .forEach(file => {
                    if(file.type !== 'image') {
                        sendMessage( { 
                            messageType: getMessageType(file.type)!,
                            attachments: [file],
                            onSubmit: onMessageSent
                        } );
                    }
                })
        }        

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

    const handleChangeTyping = useCallback((value: string) => {
        if(value.length > 0) {
            sendTypingStatus({conservationId: conservation.id, status: true});
        } else {
            sendTypingStatus({conservationId: conservation.id, status: false});
        }
    }, [ client, conservation])

    // mark you read all unread messages when open the conservation
    useEffect(() => {
        updateSeenStatus({conservation: conservation.id});
    }, [])

    useEffect(() => {
        if(addedOldMessages) {{
            messageContainerRef.current!.scrollTop = messageContainerRef.current!.scrollTop - 80;
            setAddedOldMessages(false);
        }}
    }, [ messages, addedOldMessages ])

    useLayoutEffect(() => {
        if(isLoading || !hasOldMessages || !messages || !addOldMessages)
            return;

        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                setIsLoading(true);
                getMessages({
                    conservationId: conservation.id,
                    beforeMessage: messages[0]?.id ?? undefined,
                    pageNum: 0,
                    pageSize: 15,
                })
                .unwrap()
                .then(res => {
                    if((res.data!.pageNum) >= res.data!.totalPages) {
                        setHasOldMessages(false);
                    }
                    const list = [ ...res.data!.list ];
                    oldestMessageRef.current!.scrollIntoView();
                    dispatch(addOldMessages(list.reverse()));
                    setAddedOldMessages(true);
                    setIsLoading(false);
                    setError(false);
                })
                .catch(() => {
                    setError(true);
                })
            }
        });

        observer.observe(topScrollRef.current!);

        return () => {
            if (topScrollRef.current) {
              observer.unobserve(topScrollRef.current);
            }
          };

    }, [ isLoading, hasOldMessages, messages, addedOldMessages ]);

    useEffect(() => {

        if( isFirstScrolledDown )
            return;
        if( !messages )
            return;

        if (messageContainerRef.current) {
            const container = messageContainerRef.current;
            container.scrollTop = container.scrollHeight - container.clientHeight;
            setIsFirstScrolledDown(true);
        }}, [ messages, isFirstScrolledDown ]
    )

    useEffect(() => {
        if(haveSubmitted == true) {
            scrollToNewestMessage();
            setHasSubmitted(false);
        }
    }, [haveSubmitted, scrollToNewestMessage]);


    // handle relevant message events from the socket
    useEffect(() => {
        const typingSubscribe = client.subscribe(EndPoints.MESSAGE_TYPING(conservation.id.toString()), (msg) => {
            const message: {conservation: number, user: number, status: boolean} = JSON.parse(msg.body);
            if(user.id == message.user)
                return;

            const participant = conservation
                    .participants
                    .find((participant) => participant.userId == message.user)!;


            if(message.status) {
                setTypingUsers(state => {
                    const userId =  state.find(elm => elm.userId === message.user);
                    if(userId)
                        return state;
                    else
                        return [ participant, ...state ];

                });
            } else {
                setTypingUsers(state => {
                    return state.filter(elm => elm.userId != message.user);
                })
            }
        });

        const msgSubscribe = client.subscribe(EndPoints.MESSAGE_COME, (msg) => {
            const message = JSON.parse(msg.body) as Message;

            if(message.sender != user.id) {
                setHaveNewMsg(true)
            }
        })

        return () => {
            typingSubscribe.unsubscribe();
            msgSubscribe.unsubscribe();
        }
    }, [conservation, user])

    const handleGoDownClick = () => {
        scrollToNewestMessage()
    };

    // handle scroll out of or into the latest message
    useEffect(() => {
        if(!messages)
            return;
        const observer = new IntersectionObserver((entries) => {
            if(!entries[0].isIntersecting) {
                setShowGoDown(true);
            } else {
                setShowGoDown(false);
                if(typingUsers.length > 0) {
                    scrollToNewestMessage();
                }
                if(haveNewMsg) {
                    scrollToNewestMessage()
                    setHaveNewMsg(false);
                }
                updateSeenStatus({conservation: conservation.id})
            }
        } )

        observer.observe(latestMessageRef.current!);

        return () => {
            observer.disconnect()
        }

    }, [ messages, haveNewMsg, typingUsers ])



  return (
    <div className="py-8 px-6 min-h-screen w-full relative max-h-screen">
        <div className="bg-background rounded-2xl px-8 h-full overflow-hidden flex flex-col relative">
            <ChatBoxHeader conservation={conservation}/>
            <div ref={messageContainerRef} className="mb-4 overflow-y-scroll h-full items-end flex flex-col">
                <ul className="flex flex-col gap-1 max-h-full w-full mt-auto">
                    <div ref={topScrollRef} ></div>
                    <MessageLoader hasMessages={hasOldMessages} isLoading={isLoading} error={error} messageContainerRef={messageContainerRef} />
                    {(() => {
                    let prevMessage: Message | null = null;
            
                    return sortedMessages
                    .map((msg, idx) => {
                        const prev = prevMessage;
                        prevMessage = msg;
                        const isLatest =  idx === sortedMessages.length - 1;

                        return <li 
                            ref = { idx === 0 ?  oldestMessageRef : undefined } 
                            key={msg.id || msg.tempId}>
                            <MessageItem 
                                ref={ isLatest ? latestMessageRef : undefined }
                                message={msg}
                                prevMessage={prev}
                                conservation={conservation}
                                isLatestMessage={isLatest}
                            />
                        </li>
                    })}
                )()}
                    { (typingUsers.length > 0) && 
                    <li className="flex gap-2 items-center mt-2">
                        <div>
                            { typingUsers.map( user =>
                                <Avatar key={user.userId} size="sm" src={user.userAvatar} />
                            ) }
                        </div>
                        <div className="flex gap-1 bg-sky-500 px-4 py-3.5 rounded-3xl w-fit">
                            <div className="size-2 bg-white rounded-full animate-typing opacity-0 transition"></div>
                            <div className="size-2 bg-white rounded-full animate-typing opacity-0 transition delay-300"></div>
                            <div className="size-2 bg-white rounded-full animate-typing opacity-0 delay-500"></div>
                        </div>
                        <p className="font-medium text-slate-600 text-xs"> {typingUsers[0].name} { typingUsers.length > 1 ? ` and ${typingUsers.length - 1} are typing` : ' is typing' }</p>
                    </li>}
                 <div ref={dummyBottomRef}></div>
                </ul>
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
            { showGoDown && <div className="absolute bottom-20 right-1/2 translate-x-1/2 flex flex-col items-center">
                <Button 
                    size="icon" 
                    className="bg-slate-600"
                    onClick={handleGoDownClick}>
                    <FaArrowDown />
                </Button>
                {haveNewMsg && <p className="text-xs font-medium text-slate-600">Have new message</p>}
            </div> }
            <MessageInput ref={textInputRef} attachments={attachmentsInput} setAttachments={setAttachmentInput}  onSubmit={onSubmit} onEmojiBtnClick={handleEmojiBtnToggle} onChange={handleChangeTyping}/>
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

export type MessageInputProps =  {
    attachments: AttachmentInput[],
    setAttachments: Dispatch<React.SetStateAction<AttachmentInput[]>>
    onSubmit: () => void
    onEmojiBtnClick: MouseEventHandler<HTMLButtonElement>,
    onChange: (value: string) => void 
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange">

const MessageInput = forwardRef<HTMLTextAreaElement,
MessageInputProps>(({ attachments, setAttachments, onSubmit, onEmojiBtnClick, onChange }: MessageInputProps, ref) => {

    const fileInputRef = useRef<null | HTMLInputElement>(null);

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
            if(event.key === "Enter") {
                event.preventDefault();
                handleSubmit();
            }
        }
    
    const handleFileBtnClick = () => {
        fileInputRef!.current?.click();
    }

    const handleSubmit = () => {
        onSubmit();
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        let newAttachments: AttachmentInput[] = [];

        if(files) {
            // transform input file to Attachment inputs
            Array.from(files).forEach(( file ) => {
                const existed =  attachments.find(attachment => {
                    const attachmentFile = attachment.file;
                    return attachmentFile.name == file.name &&
                        attachmentFile.size == file.size &&
                        attachmentFile.type == file.type;
                })

                if(!existed) {
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

                    newAttachments.push( {
                        id: new Date().getTime(),
                        fileName: file.name,
                        fileType: file.type,
                        type,
                        file,
                        url: url,
                        createdAt: new Date().toISOString()
                    })
                }
            })

            fileInputRef.current!.value = '';

            setAttachments((prevState) => [...prevState, ...newAttachments])
        }
    }

    const handleRemoveSelectedFile = (attachment: Attachment) => {
        const fileIndex = attachments.findIndex(attach => attach === attachment);
    
        if(fileIndex != -1) {
            attachments.splice(fileIndex, 1);
            setAttachments([...attachments])
        }
    }

    return (<div className="sticky bottom-0 left-0 bg-background py-3">
       {
            attachments.length != 0 && <div className="absolute bg-background-active w-full h-24 -top-[110%] rounded-xl flex items-center gap-2 px-4 overflow-x-scroll bg-opacity-85">
            {attachments.map(atm => {
                return (
                    <SelectedFile key={atm.fileName} attachment={atm} onRemove={() => handleRemoveSelectedFile(atm)} />
                )
            })}
        </div>
       }
        <div className="bg-inherit border-primary border rounded-3xl flex items-center">
            <div className="flex px-2">
                <input type="file" hidden ref={ fileInputRef } onChange={handleFileChange} multiple />
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
            <textarea ref={ref} rows={1} className="w-full resize-none py-2 focus:outline-none bg-inherit" placeholder="Send a message" onKeyDown={handleKeyDown} onChange={(e) => onChange(e.target.value)}/>
            <div>
                <Button variant="ghost" size="icon" className="size-8 mx-2" onClick={handleSubmit}>
                    <LuSendHorizonal />
                </Button>
            </div>
        </div>
    </div>)
})


const SelectedFile = ({ attachment, onRemove } : { attachment: AttachmentInput, onRemove: () => void }) => {
    return (
        <div className="relative">
            <Button className="absolute top-0 right-0 shrink-0 size-8 translate-x-1/3 -translate-y-1/3 z-10" size="icon" variant="ghost" >
                <MdCancel className="size-5 text-red-600" onClick={onRemove} />
            </Button>
            {(attachment.type === 'image')
                    && (
                        <div key={attachment.id} className="rounded-lg overflow-hidden shrink-0">
                            <img src={attachment.url!} className="object-contain max-h-14"/>
                        </div>
            )}
            { (attachment.type === 'video')
                    && (
                        <div key={attachment.id} className="max-w-24 max-h-14 rounded-lg overflow-hidden shrink-0">
                            <video src={attachment.url!} />
                        </div>
                )}
             {( attachment.type === 'file')
                    && (
                        <div className="w-32 h-10 py-2 px-1.5 bg-violet-500 rounded-lg flex items-center gap-1">
                            <FaFileAlt className="shrink-0" />
                            <p className="text-sm font-medium text-nowrap text-ellipsis  overflow-hidden">{attachment.fileName}</p>
                        </div>
            )}
        </div>
    )
}

type MessageLoaderProps = {
    isLoading: boolean,
    error: boolean,
    hasMessages: boolean,
    messageContainerRef: MutableRefObject<HTMLDivElement | null>
}

const MessageLoader = ({ isLoading, error, hasMessages, messageContainerRef } : MessageLoaderProps ) => {

    var show = false;
    if(messageContainerRef.current) {
        var computed = getComputedStyle(messageContainerRef.current);
        var padding = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom);
        show = messageContainerRef.current.scrollHeight > messageContainerRef.current.offsetHeight - padding + 100;
    }

    return (
        <div
        className="w-full min-h-20 flex justify-center items-center shrink-0">
            { isLoading && <SimpleSpinner />}
            { error && <p className="text-red-600">Have error when loading</p> }
            { !hasMessages && show && <p className="font-medium">There are no old messages</p> }
    </div>
    )
}

export default ChatBox;
