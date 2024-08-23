import { Client } from "@stomp/stompjs";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentAuthentication } from "../auth/auth-slice";
import { Message } from "../message/message-type";
import { addMessage } from "../message/message-slice";
import { updateLatestMsg } from "../conservation/conservation-slice";

const accessToken = localStorage.getItem("accessToken");

const socket : {
    client: undefined | Client
} = {
    client: undefined
}

const useSocket = () => {
    const user = useSelector(getCurrentAuthentication);
    
    const dispatch = useDispatch();

    if(!socket.client) {
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            onConnect: () => {
                console.log("HELLO")
                client.subscribe(`/user/${user.id}/message`, (message) => {
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