import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { EmailState, userEmailState } from "./store/selectors/userEmailState";

import "./Chat.css"; // Import the CSS file for additional styles

const socket = io.connect("http://localhost:3000");

function Chat() {
  let num = 1;
  let { admin } = useParams();
  const [currentMessage, setCurrentMessage] = useState("");
  const username = useRecoilValue(EmailState);
  const adminname = useRecoilValue(userEmailState);
  const [messageList, setMessageList] = useState([]);


  const navigate = useNavigate();

  if(!adminname && !username){
    navigate("/");
  }

  const messageContainerRef = useRef(null);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
        room: admin,
        message: currentMessage,
        sender: adminname || username
      
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      if (username) {
        await axios.post(
          "http://localhost:3000/user/chat/" + admin,
          {
            time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
            room: admin,
            message: currentMessage,
            sender: username
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
      } else {
        if (adminname) {
          await axios.post(
            "http://localhost:3000/admin/chat/" + admin,
            {
              time:
              new Date(Date.now()).getHours() +
              ":" +
              new Date(Date.now()).getMinutes(),
              room: admin,
              message: currentMessage,
              sender:adminname
             
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
        }
      }
    }
    setCurrentMessage('');
    scrollToBottom();

  };

  useEffect(() => {
    socket.emit("join_room", admin);
    if (username) {
      axios
        .get("http://localhost:3000/user/chat/" + admin, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          console.log({res})
          setMessageList(res.data.messages);
        })
        .catch((error) => {
          console.error(error);
          setMessageList([]);
        });
    } else {
      axios
        .get("http://localhost:3000/admin/chat/" + admin, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          console.log({res})
          setMessageList(res.data.messages);
        })
        .catch((error) => {
          console.error(error);
          setMessageList([]);
        });
    }

    scrollToBottom();
    if (num == 1)
      socket.on("receive", (data) => {
        setMessageList((list) => [...list, data]);
      scrollToBottom();

      });
    num++;
  }, [admin]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  return (
  
    <div className="chat-container">
      <div className="chat-header">
        <h1>Admin cum classroom chat</h1>
      </div>
      <div className="message-list" ref={messageContainerRef}>
  {messageList.map((msg, index) => (
    <div key={index} className={msg.sender === username ? "sender-message" :
      (msg.sender === adminname ? "admin-sender-message" :( msg.sender === admin? "admin-sender-message":"receiver-message"))}>
      <div className="message-content">
        <strong className="message-sender">{msg.sender}</strong>
        <p>{msg.message}</p>
      </div>
      <div className="message-time">
        {msg.time}
      </div>
    </div>
  ))}
</div>
      <div className="input-container">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
