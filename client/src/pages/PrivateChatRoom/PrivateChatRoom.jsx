import React, { useState, useEffect, useContext, useRef } from "react";
import Navbar from "../../components/NavBars/NavMain";
import UserList from "../../components/UserList";
import { MdSend } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import "./PrivateChatRoom.css";
import useGetPrivateChat from "../../hooks/useGetPrivateChat";
import Conversation from "../../components/Conversation";
import { AuthContext } from "../../context/AuthContext";
import useCreateMessage from "../../hooks/useCreateMessage";
import { io } from "socket.io-client";

export const PrivateChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState(null);
  const [textValue, setTextValue] = useState("");
  const { auth } = useContext(AuthContext);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [unreadUsers, setUnreadUsers] = useState([]);

  const { error, getPrivateChat, cancelPrivateChatFetch } =
    useGetPrivateChat(setChatId);
  const userId = auth.id;

  useEffect(() => {
    socket.current = io("https://c42-team-c.herokuapp.com/", {
      transports: ["websocket"],
    });

    fetchUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    return () => {};
  }, []);

  useEffect(() => {
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        user_id: data.senderId,
        message_text: data.text,
        sent_datetime: new Date().toISOString(),
        chat_id: data.chatId,
      });

      setUnreadUsers((prevUnreadUsers) => {
        if (!prevUnreadUsers.includes(data.senderId)) {
          return [...prevUnreadUsers, data.senderId];
        }
        return prevUnreadUsers;
      });
    });
    return () => {};
  }, []);

  useEffect(() => {
    socket.current.emit("addUser", auth.id);
  }, [auth]);

  const { createMessage } = useCreateMessage();

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (textValue.trim().length === 0) {
      return;
    }

    const user = JSON.parse(localStorage.getItem("auth"));
    const newMessage = {
      user_id: user.id,
      message_text: textValue,
      chat_id: chatId,
    };

    socket.current.emit("sendMessage", {
      senderId: user.id,
      receiverId: selectedUserId,
      text: textValue,
      chatId: chatId,
    });
    try {
      createMessage(user, newMessage);
      setMessages([
        ...messages,
        {
          user_id: user.id,
          message_text: textValue,
          sent_datetime: new Date().toISOString(),
        },
      ]);
      setTextValue("");
    } catch (error) {
      alert.error("Error sending message:", error);
    }
  };

  const handleSendMessage = (e) => {
    sendMessage(e);
  };

  useEffect(() => {
    getPrivateChat(selectedUserId, userId);

    setUnreadUsers((prevUnreadUsers) =>
      prevUnreadUsers.filter((user) => user !== selectedUserId)
    );
  }, [selectedUserId]);

  useEffect(() => {
    return cancelPrivateChatFetch();
  }, []);

  useEffect(() => {
    if (error) {
      setChatId(null);
    }
  }, [error]);

  const handleUserClick = (id) => {
    setSelectedUserId(id);
  };

  async function fetchUsers() {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      return data;
    } catch (error) {
      return [];
    }
  }

  return (
    <div>
      <Navbar />
      <div className="private-chat-page-container">
        <div className="users-list">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <UserList
              users={users}
              handleUserClick={handleUserClick}
              selectedUser={selectedUserId}
              avatarIcon={<FaUserCircle className="user-chat-icon" />}
              unreadUsers={unreadUsers}
            />
          )}
        </div>
        <div className="chat-section">
          <div className="chat-box">
            {!selectedUserId && (
              <div className="select-user-hint">
                Select a contact to continue
              </div>
            )}
            {chatId && (
              <Conversation
                chatId={chatId}
                userId={userId}
                messages={messages}
                setMessages={setMessages}
                arrivalMessage={arrivalMessage}
              />
            )}
          </div>
          {selectedUserId && (
            <div className="send-message-container">
              <textarea
                placeholder="Message"
                className="message-field"
                value={textValue}
                onChange={handleTextChange}
                required
              />
              <MdSend className="send-button" onClick={handleSendMessage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivateChatRoom;
