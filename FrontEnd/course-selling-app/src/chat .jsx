import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
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
  const [selectedAttachment,setSelectedAttachment]=useState(null);
  const [isAttachmentModalOpen, setAttachmentModalOpen] = useState(false);

  const openAttachmentModal = () => {
    setAttachmentModalOpen(true);
  };

  const closeAttachmentModal = () => {
    setAttachmentModalOpen(false);
    setSelectedAttachment(null);
  };
  
  const handleAttachmentChange = (e)=>{
    setSelectedAttachment(e.target.files[0]);
  };

  const downloadAttachment = (attachmentName) => {
    console.log(attachmentName)

    const options = {
  width: 800, // Width of the new window
  height: 600, // Height of the new window
  left: 100, // X-coordinate of the new window
  top: 100, // Y-coordinate of the new window
  location: 1, // Show the address bar (0 for no, 1 for yes)
  toolbar: 0, // Show the toolbar (0 for no, 1 for yes)
  menubar: 0, // Show the menu bar (0 for no, 1 for yes)
  scrollbars: 1, // Show scrollbars (0 for no, 1 for yes)
};

// Open the URL in a new window with options
 window.open(attachmentName.attachment, "_blank", options);
  };




  const messageContainerRef = useRef(null);

  const sendMessage = async () => {
    if (currentMessage !== "" || selectedAttachment!=null) {
      var formData = new FormData();
      formData.append('attachment',selectedAttachment);
      formData.append('room',admin);
      formData.append('message',currentMessage);
      formData.append('time',new Date(Date.now()).getHours() +
      ":" +
      new Date(Date.now()).getMinutes());

      console.log(selectedAttachment);
      const messageData = {
        time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
        room: admin,
        message: currentMessage,
        sender: adminname || username,
        attachment:selectedAttachment
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      if (username) {
        await axios.post(
          "http://localhost:3000/user/chat/" + admin,formData,
         
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              "Authorization": "Bearer " + localStorage.getItem("token")
            },
          });
      } else {
        if (adminname) {
          console.log(selectedAttachment);
          await axios.post(
            "http://localhost:3000/admin/chat/" + admin,formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data', // Required for file upload
                "Authorization": "Bearer " + localStorage.getItem("token")
              },
            });
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
    if (num == 1){
      socket.on("receive", (data) => {
        setMessageList((list) => [...list, data]);
      scrollToBottom();

      });
    }
     
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
        {msg.message && <p>{msg.message}</p>}
        {msg.attachment && (
                <div>
                  <p>Attachment: {msg.attachment.name}</p>
                  <button
                    onClick={() => downloadAttachment(msg)}
                  >
                    Download
                  </button>
                </div>
              )}
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
        <button onClick={openAttachmentModal}>📎</button>
      
        {isAttachmentModalOpen && (
        <div className="attachment-modal-overlay">
          {/* Attachment modal */}
          <div className="attachment-modal">
            <button className="close-button" onClick={closeAttachmentModal}>
              &times;
            </button>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={handleAttachmentChange}
              className="file-input"
            />
            <button onClick={sendMessage} className="upload-attach">Upload Attachment</button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Chat;
