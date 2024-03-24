import React, { useEffect, useRef, useState } from "react";
import "./chatbox.css";
import image from "../../styles/salute.jpg";
import { ChatState } from "../../context/ChatProvider";
import Spinner from "../spinner/Spinner";

import { getTime, isSameSender, isFirstMessage } from "../../config/chatLogic";

function ChatBox({ messages, isLoading, isTyping, chat }) {
  const isGroupChat = chat.isGroupChat;
  console.log(messages);
  const chatContainerRef = useRef(null);

  const { user } = ChatState();
  useEffect(() => {
    // Scroll to the bottom when new messages are added
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  // console.log(messages.map((m)=>console.log(m.sender._id)))

  return (
    <div className="chatbox" ref={chatContainerRef}>
      {/* <div className="messages"> */}
      {isLoading ? (
        <Spinner width={60} height={60} />
      ) : messages.length > 0 ? (
        messages.map((message, i) =>
          message.groupNotice ? (
            <div className="center-message"> <div className="message-text">
              {message.notice.noticetype === "remove"
                ? message.sender._id === message.notice.noticeTo._id
                  ? (message.sender._id !== user._id &&
                    `${message.notice.noticeTo.name} exit`)
                  : message.sender._id === user._id &&
                    user._id !== message.notice.noticeTo._id
                  ? `You removed ${message.notice.noticeTo.name}`
                  : message.sender._id !== user._id &&
                    user._id === message.notice.noticeTo._id
                  ? `${message.sender.name} removed you`
                  : `${message.sender.name} removed ${message.notice.noticeTo.name}`
                : `someone added you`}</div>
            </div>
          ) : message.sender._id == user._id ? (
            <div className="my-message">
              <div className="text">
                <p> {message.content}</p>
                <span>{getTime(message.createdAt)}</span>
              </div>
            </div>
          ) : (
            <div className="friend-message">
              {isGroupChat && (
                <div className="image">
                  {(isFirstMessage(messages, i, user._id) ||
                    isSameSender(messages, message, i, user._id)) && (
                    <img src={message.sender.pic} alt="" />
                  )}
                </div>
              )}

              <div className={`text ${!isGroupChat && `text-single`}`}>
                <p>{message.content}</p>
                <span>{getTime(message.createdAt)}</span>
              </div>
            </div>
          )
        )
      ) : (
        <div className="center">start chat</div>
      )}
      {isTyping && <div className="typing">typing..</div>}
    </div>
    // </div>
  );
}

export default ChatBox;
