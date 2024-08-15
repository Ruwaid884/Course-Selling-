import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {  useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { chatMessagesState } from "./store/atoms/message"; // Import your atom
import { EmailState, userEmailState } from "./store/selectors/userEmailState";
import "./Chat.css";
import Loader from "./circle";
import { Flag } from "@mui/icons-material";

const socket = io.connect("http://localhost:3000");

function Chat() {
  const { admin } = useParams();
  const [currentMessage, setCurrentMessage] = useState("");
  const username = useRecoilValue(EmailState);
  const adminname = useRecoilValue(userEmailState);
  const [messageList, setMessageList] = useRecoilState(chatMessagesState);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [isAttachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const messageContainerRef = useRef(null);
  const [Loading , setLoading] = useState(false);


  useEffect(() => {
    socket.emit("join_room", admin);
    fetchMessages();
    setupSocketListeners();

    return () => {
      socket.off("receive");
    };
  }, [adminname,username]);


  useEffect(()=>{
    scrollToBottom();
  },[messageList])


  const split = (url)=>{
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1]; 
    const nameParts = lastPart.split('-');
    const extractedName = nameParts[1]; 
    return extractedName;

  }

  const fetchMessages = async () => {
    const url = `http://localhost:3000/${adminname ? 'admin' : 'user'}/chat/${admin}`;
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessageList(res.data.messages);
    } catch (error) {
      setMessageList([]);
    }
  };

  const setupSocketListeners = () => {
    socket.on("receive", (data) => {
      setMessageList((oldMessages) => [...oldMessages, data]);
    });
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  const openAttachmentModal = () => setAttachmentModalOpen(true);
  const closeAttachmentModal = () => {
    setAttachmentModalOpen(false);
    setSelectedAttachment(null);
  };
  const handleAttachmentChange = (e) => setSelectedAttachment(e.target.files[0]);

  const downloadAttachment = (attachmentName) => {
    const options = {
      width: 800,
      height: 600,
      left: 100,
      top: 100,
      location: 1,
      toolbar: 0,
      menubar: 0,
      scrollbars: 1,
    };
    window.open(attachmentName.attachment, "_blank", options);
  };

  const sendMessage = async () => {
    setLoading(true);
    if (currentMessage.trim() || selectedAttachment) {
      const formData = new FormData();
      formData.append('attachment', selectedAttachment);
      formData.append('room', admin);
      formData.append('sender',username?username:adminname)
      formData.append('message', currentMessage);
      formData.append('time', new Date().toLocaleTimeString());

      const messageData = {
        time: new Date().toLocaleTimeString(),
        room: admin,
        message: currentMessage,
        sender: adminname || username,
        attachment: selectedAttachment,
      };

      await socket.emit("send_message", messageData);
      setMessageList((oldMessages) => [...oldMessages, messageData]);


      const url = `http://localhost:3000/${adminname ? 'admin' : 'user'}/chat/${admin}`;
       axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then(async()=>{
        if(selectedAttachment){setLoading(true); await fetchMessages();}
        setLoading(false);
        closeAttachmentModal();
        setCurrentMessage('');
        setSelectedAttachment(null);
      });

     
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Admin cum Classroom Chat</h1>
      </div>
      <div className="message-list" ref={messageContainerRef}>
        {messageList.map((msg, index) => (
          <div key={index} className={
            msg.sender === username ? "sender-message" :
            msg.sender === adminname || msg.sender ===admin ? "admin-sender-message" : "receiver-message"
          }>
            <div className="message-content">
              <strong className="message-sender">{msg.sender}</strong>
              {msg.message && <p>{msg.message}</p>}
              {msg.attachment && (
                <div>
                  <p>Attachment: {msg.attachment.name ? msg.attachment.name : split(msg.attachment)}</p>
                  <button onClick={() => downloadAttachment(msg)}>Download</button>
                </div>
              )}
            </div>
            <div className="message-time">{msg.time}</div>
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
        <button onClick={()=>{sendMessage(); scrollToBottom();}}>Send</button>
        <button onClick={openAttachmentModal}>📎</button>
        {isAttachmentModalOpen && (
          <div className="attachment-modal-overlay">
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
              <button onClick={()=>{sendMessage(); scrollToBottom();}} className="upload-attach">Upload Attachment</button>
            </div>
            {Loading && <Loader flag={false} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
