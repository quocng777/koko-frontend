import { Client } from "@stomp/stompjs";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentAuthentication } from "../auth/auth-slice";
import { Message, MessageSeen } from "../message/message-type";
import { addMessage, updateSeenStatus } from "../message/message-slice";
import { updateLatestMsg } from "../conservation/conservation-slice";
import { useState } from "react";
import { useEndpoints } from "../../../hook/use-endpoints";

const accessToken = localStorage.getItem("accessToken");

const socket : {
    client: undefined | Client
} = {
    client: undefined
}

const useSocket = () => {
    const user = useSelector(getCurrentAuthentication);
    const EndPoints = useEndpoints();
    
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
            }
        });

        client.activate();

        socket.client = client;

    }

    return { 
        client: socket.client
     };    
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