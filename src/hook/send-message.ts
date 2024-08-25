import { useDispatch, useSelector } from "react-redux";
import { Conservation } from "../app/api/conservation/conservation-type";
import { Attachment, Message, MessageSendParams, MessageType } from "../app/api/message/message-type";
import { getCurrentAuthentication } from "../app/api/auth/auth-slice";
import { addLocalMessage, updateHasErrorLocalMessage, updateLocalMessage } from "../app/api/message/message-slice";
import { updateLatestMsg } from "../app/api/conservation/conservation-slice";
import { useSendMessageMutation } from "../app/api/message/message-api-slice";
import { useMediaUpload } from "./upload-media";
import { AttachmentInput } from "../features/message/chat-box";
import { v4 as uuidv4 } from 'uuid';

export type UseSendMessageProps = {
    conservation: Conservation,

}

export type SendMessageProps = {
    messageType: MessageType,
    text?: string,
    attachments?: AttachmentInput[],
    onSubmit?: () => void 
}

export const useSendMessage = ({ conservation } : UseSendMessageProps) => {

    const user = useSelector(getCurrentAuthentication);
    const dispatch = useDispatch();
    const [ sendMessage ] = useSendMessageMutation();
    const sendAttachment = useMediaUpload();

    return async ({ messageType, text, attachments, onSubmit } : SendMessageProps) => {

        const rowAttachments = attachments?.map((att): Attachment => {
            const {
                file,
                type,
                ...attachment
            } = att;

            return attachment
        }) || []

        const localMessage: Message = {
            id: null,
            conservation: conservation.id,
            sender: user.id,
            message: text || '',
            createdAt: new Date().toISOString(),
            type: messageType,
            attachments: rowAttachments,
            hasError: false,
            tempId: uuidv4()
        };
    
        dispatch(addLocalMessage(localMessage));
        dispatch(updateLatestMsg(localMessage));

        // handle additional submitting event        
        if (onSubmit)
            onSubmit();
    
        const rq: MessageSendParams = {
            conservation: conservation.id,
            message: text,
            type: messageType,
            attachments: attachments
        };
    
        if(messageType == MessageType.TEXT) {
            sendMessage(rq).unwrap()
            .then((res) => {
                const data = res.data as Message;
                // dispatch(deleteLocalMessage({conservation: conservation.id, tempId: localMessage.tempId!}));
                // dispatch(addMessage(data));
                dispatch(updateLocalMessage({message: data, tempId: localMessage.tempId!}));
            }).catch(() => {
                dispatch(updateHasErrorLocalMessage({conservation: localMessage.conservation, tempId: localMessage.tempId!}));
            })

        } 
        else if(messageType === MessageType.IMAGE) {
            const promises = attachments!.map(img => {
                async function upAttachment (): Promise<Attachment> {
                    const data = await sendAttachment(img.file!)
                    return {
                        fileName: img.fileName,
                        url: data.url,
                        fileType: img.fileType,
                        keyObject: data.keyObject
                    }
                }

                return upAttachment()
            })

            Promise.all(promises)
                .then((attachments) => {
                    rq.attachments = attachments;
                    sendMessage(rq).unwrap()
                .then((res) => {
                    const data = res.data as Message;
                    // dispatch(deleteLocalMessage({conservation: conservation.id, tempId: localMessage.tempId!}));
                    // dispatch(addMessage(data));
                    dispatch(updateLocalMessage({message: data, tempId: localMessage.tempId!}));
                }).catch(() => {
                    localMessage.hasError = true;
            })
        })} 
        else {
            sendAttachment(attachments![0].file)
                .then(({ url, keyObject }) => {
                    const attachment: Attachment = {
                        fileName: attachments![0].fileName,
                        url,
                        fileType: attachments![0].fileType,
                        keyObject
                    }
                    
                    rq.attachments = [attachment];

                    sendMessage(rq).unwrap()
                    .then((res) => {
                        const data = res.data as Message;
                        // dispatch(deleteLocalMessage({conservation: conservation.id, tempId: localMessage.tempId!}));
                        // dispatch(addMessage(data));
                        dispatch(updateLocalMessage({message: data, tempId: localMessage.tempId!}));
                    }).catch(() => {
                        localMessage.hasError = true;
                    })
                })
        }
    }
}