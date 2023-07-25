import React, { useEffect, useRef } from "react";
import { useGetAnswersByQuestionId } from "../hooks/useGetAnswersByQuestionId";
import PropTypes from "prop-types";

export default function Conversation({
  chatId,
  userId,
  messages,
  setMessages,
  arrivalMessage,
}) {
  const lastMessageRef = useRef(null);
  const {
    isLoadingGetAnswers,
    performGetAnswersByQuestionId,
    cancelGetAnswersByQuestionId,
  } = useGetAnswersByQuestionId(setMessages, chatId);

  useEffect(() => {
    performGetAnswersByQuestionId();
    return cancelGetAnswersByQuestionId;
  }, [chatId]);
  useEffect(() => {
    arrivalMessage &&
      arrivalMessage?.chat_id === chatId &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

  let loadingConversation = null;
  if (isLoadingGetAnswers) {
    loadingConversation = <div>Conversation Loading ...</div>;
  }

  const getFormattedDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString("en", { month: "long" });
    return `${day} ${month}`;
  };

  return (
    <>
      {loadingConversation}
      <div className="conversation-container">
        {messages.length === 0 ? (
          <p className="message-content">No messages yet</p>
        ) : (
          messages.map((message, index) => (
            <div
              className={`messages ${
                message.user_id === userId ? "left-section" : "right-section"
              }`}
              key={index}
              ref={messages.length - 1 === index ? lastMessageRef : null}
            >
              <div className="message-container">
                <div className="message-text">{message.message_text}</div>
                <div className="message-time">
                  {getFormattedDate(message.sent_datetime)}{" "}
                  {message.sent_datetime.split("T")[1].slice(0, 5)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

Conversation.propTypes = {
  chatId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  setMessages: PropTypes.func.isRequired,
  arrivalMessage: PropTypes.object,
};
