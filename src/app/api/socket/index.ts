import { Client, messageCallbackType } from "@stomp/stompjs";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentAuthentication } from "../auth/auth-slice";
import { Message, MessageSeen } from "../message/message-type";
import { addMessage, updateDeletedMessage, updateSeenStatus } from "../message/message-slice";
import { increaseUnreadMessage, updateLatestMsg } from "../conservation/conservation-slice";
import { useEndpoints } from "../../../hook/use-endpoints";
import { Notification } from "../notification/notification-type";
import { increaseNotification } from "../notification/notification-slice";
import { useToast } from "../../../hook/use-toast";
import { useEffect } from "react";

const accessToken = localStorage.getItem("accessToken");

const socket : {
    client: undefined | Client
} = {
    client: undefined
}

const useSocket = () => {
    const user = useSelector(getCurrentAuthentication);
    const EndPoints = useEndpoints();
    const toast = useToast();
    const dispatch = useDispatch();

    if(!socket.client) {
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            onConnect: () => {
                client.subscribe(EndPoints.MESSAGE_COME, (message) => {
                    const msg = JSON.parse(message.body) as Message;

                    if(msg.sender !== user.id) {
                        dispatch(addMessage(msg));
                        dispatch(updateLatestMsg(msg));
                        dispatch(increaseUnreadMessage(msg.conservation))
                    } else {
                        setTimeout(() => {
                            dispatch(addMessage(msg));
                            dispatch(updateLatestMsg(msg));
                        }, 50)
                    }
                })

                client.subscribe(EndPoints.MESSAGE_SEEN, (message) => {
                    const msg = JSON.parse(message.body) as MessageSeen;
                    
                    if(msg.user !== user.id) {
                        dispatch(updateSeenStatus(msg));
                    }
                })

                client.subscribe(EndPoints.MESSAGE_DELETE, (message) => {
                    const msg = JSON.parse(message.body) as Message;
                    dispatch(updateDeletedMessage({
                        conservationId: msg.conservation,
                        messageId: msg.id!,
                        deletedAt: msg.deletedAt!,
                    }))
                })

                client.subscribe(EndPoints.NOTIFICATION, (message) => {
                    let notification = JSON.parse(message.body) as Notification;
                    dispatch(increaseNotification());
                    console.log(toast.open)
                    toast.open(notification);

                })
            }
        });

        client.activate();

        socket.client = client;

    } 
}

export const topicSubscribe = async(topic: string, callback: messageCallbackType) => {
    while(!socket.client?.connected) {
        await new Promise((resolve) => {
            setTimeout(resolve, 100) // stop 100ms to resubscribe
        })
    }

    return socket.client.subscribe(topic, callback)
}

export const useSubscribeTopic = (topic: string, callback: messageCallbackType, dependencies: any[]) => {
    useEffect(() => {
        const subscription = topicSubscribe(topic, callback);

        return () => {
            subscription
                .then(res => res.unsubscribe())
        }
    }, dependencies)
}

export const sendTypingStatus = ({ conservationId, status }: { conservationId: number, status: boolean }) => {
    socket.client?.publish({
        destination: '/app/typing',
        body: JSON.stringify({
            conservation: conservationId,
            status
        })
    })
};
export default useSocket;