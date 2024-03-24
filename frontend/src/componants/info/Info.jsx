import React, { useEffect, useState } from "react";
import "./info.css";
import { FaChevronDown, FaMinusCircle, FaArrowRight} from "react-icons/fa";
import image from "../../styles/salute.jpg";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";

function Info({ chat, isGroupUser, setMessages, messages, socket }) {
  
  const { user, chats, setChats } = ChatState();
 
  const groupChat = chat.isGroupChat;
  
  const removeMethod= async(chatId, userId, users)=>{
    const {data}=await axios.post('/api/chat/removeUser',{chatId, userId} )
    socket.emit('remove user', {data, users })
    //  console.log(data)
    // const updatedUsers= data.removed.users.filter((u)=>u._id !== user._id)
    setMessages([...messages, data.messageData])
    
    const chatIndex = chats.findIndex(chat=> chat._id === data.removed._id)
    if (chatIndex !== -1){
      chats[chatIndex].prevUsers= data.removed.prevUsers;
      chats[chatIndex].users= data.removed.users;
      setChats([...chats])
    }
    // data.removed.users
  }
  const friend = chat.users.filter((u) => u._id !== user._id)[0];
  const removeUser=async(userId, username)=>{
    if(window.confirm(`are you sure want to remove ${username}?`)){
    const chatId=chat._id
    const users=chat.users
    removeMethod(chatId, userId, users)
  }

  else return
}
const exitFromGroup= async()=>{
 if(window.confirm(`are you sure want to exit from group?`)){
  var chatId=chat._id
  var userId=user._id
  const chatUsers= chat.users

   removeMethod(chatId, userId, chatUsers)

 }
 else return
}
const deleteChat= async()=>{
  if(window.confirm(`are you sure want to delete this Chat?`)){
    alert("delete chat")
  }
}
const deleteGroup=async()=>{
  if(window.confirm(`are you sure want to delete this group?`)){
    alert("delete")
  }
  else return
}

  return (
    <div className="user-info">
      <input type="checkbox" id="gallery" />
      <div className="image-name">
        <div className="image">
          <img src={groupChat ? chat.pic : friend.pic} alt="" />
        </div>
        {!groupChat && <div className="active-user">Active</div>}
        <div className="name">
          <span>{groupChat ? chat.chatName : friend.name}</span>
        </div>
      </div>
      <div className="other-info">
        <div className="custom-chat">
          <span>Customize chat</span>
          <FaChevronDown />
        </div>
        <div className="privacy">
          <span>Privacy and Support</span>
          <FaChevronDown />
        </div>
       
        {/* <div className="media">
          <span>Shared Media</span>
          <label htmlFor="gallery">
            <FaChevronDown />
          </label>
        </div> */}
      </div>
      {/* <div className="gallery">
        <img src={image} alt="" />
        <img src={image} alt="" />
        <img src={image} alt="" />
        <img src={image} alt="" />
        <img src={image} alt="" />
        <img src={image} alt="" />
      </div> */}

      {groupChat && <div className="group-contacts">
        <div className="heading">
          Group Contacts
        </div>
        <div className="contacts">
        {chat.users.map(u=> (u._id!==user._id) && (<div className="contact" key={u._id}>
          
          <div className="image">
            <img src={u.pic} alt="" />
          </div>
          <span>{u.name}</span>
        
          {groupChat && (chat.groupAdmin._id===user._id) && <div onClick={(e)=>removeUser(u._id, u.name)} className="remove-icon">
            <FaMinusCircle/>
          </div>}
        </div>))}
        </div>
      </div>}
      {groupChat ?( isGroupUser? <button className="exit-group" onClick={exitFromGroup}>
        Exit <FaArrowRight/>
      </button> : <button className="exit-group" onClick={deleteGroup}>
        Delete <FaArrowRight/>
      </button>) : <button className="exit-group" onClick={deleteChat}>Delete Chat </button>}
    </div>
  );
  
}

export default Info;
