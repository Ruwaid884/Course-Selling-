import { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3000");
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { EmailState, userEmailState } from "./store/selectors/userEmailState";

function name({username,adminname}){

    if(username) return username;
    else return adminname

}


function Chat(){
    let {admin} = useParams();
    const [currentMessage,setCurrentMessage] = useState("");
    const username = useRecoilValue(EmailState);
    const adminname = useRecoilValue(userEmailState);
    const [messageList,setMessageList] = useState([]);


    const sendMessage = async()=>{
        if(currentMessage !==""){
            const messageData = {
                room:admin,
                sender:name({username,adminname}),
                message:currentMessage,
                time: new Date(Date.now()).getHours()+ ":" +
                new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message",messageData);
            setMessageList((list)=>[...list,messageData]);
        }
    }

    useEffect(()=>{
        socket.emit("join_room", admin);
        socket.on("receive",(data)=>{
            setMessageList((list)=>[...list,data]);
        })
    
    },[admin]);


    
return <div>
<h1>Admin cum classroom chat</h1>
<div style={{ height: '400px', border: '1px solid #ccc', padding: '10px', overflowY: 'scroll' }}>
        {messageList.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: msg.sender === name({ username, adminname }) ? "row-reverse" : "row",
              margin: "8px",
            }}
          >
            <div
              style={{
                backgroundColor: msg.sender === name({ username, adminname }) ? "#bde4ff" : "#bd3999",
                padding: "8px",
                borderRadius: "8px",
                maxWidth: "70%",
              }}
            >
              <strong>{msg.sender}: </strong>
              {msg.message}
            </div>
          </div>
        ))}
      </div>
<input
  type="text"
  onChange={(e) => setCurrentMessage(e.target.value)}
  placeholder="Type your message..."
/>
<button onClick={sendMessage}>Send</button>
</div>
}

export default Chat;