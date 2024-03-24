import React from 'react'
import './chat.css'
import {ChatState} from '../../context/ChatProvider'
function Chat({chat}) {
    console.log(chat.latestMessage)
    const {user}=ChatState()
   const friend=chat.users.filter(u=>u._id !==user._id)[0]
    // console.log(friend)
    // console.log(chat)
  return (
      <div className="chat">
        <div className="profile-image">
            <div className="image">
                {chat.isGroupChat ? <img src={chat.pic} alt=""/>:<img src={friend.pic} alt=""/>}
                
            </div>
        </div>

        <div className="chat-name-message">
            <h4>{chat.isGroupChat? chat.chatName: friend.name}</h4>
            <span>{chat.latestMessage && chat.latestMessage.content}</span>
        </div>
    </div>

  )
}

export default Chat

