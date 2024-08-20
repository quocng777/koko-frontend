import { Client } from "@stomp/stompjs";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentAuthentication } from "../auth/auth-slice";
import { Message } from "../message/message-type";
import { addMessage } from "../message/message-slice";
import { updateLatestMsg } from "../conservation/conservation-slice";

const accessToken = localStorage.getItem("accessToken");

const useSocket = () => {
    const user = useSelector(getCurrentAuthentication);
    
    const dispatch = useDispatch();

    const client = new Client({
        brokerURL: 'ws://localhost:8080/ws',
        connectHeaders: {
            Authorization: `Bearer ${accessToken}`,
        },
        onConnect: () => {
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
 
    return client;
}

export default useSocket;