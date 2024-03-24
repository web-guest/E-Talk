import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaSearch} from 'react-icons/fa'
import {ChatState} from '../../context/ChatProvider'
import Users from '../users/Users'
import {toast} from 'react-toastify'
import axios from 'axios'


function Sidebar({sidebarOpen, closeSidebar, currentChat, setCurrentChat}) {
  const[search, setSearch]=useState("")
    const {friends, chats, setChats}=ChatState()
    const [searchFriends, setSearchFriends]=useState()
    const [activeChat, setActiveChat]=useState("")

    useEffect(()=>{
      setSearchFriends(friends)
    },[setSearchFriends,friends])

    const handleSubmit=async(e)=>{
         e.preventDefault()
    }
    
      const handleChange = async (e) => {
      const input=e.target.value
      setSearch(input);
      const results=friends.filter(friend => {
        const nameMatch = friend.name && friend.name.match(new RegExp(input, "i"));
        const emailMatch = friend.email && friend.email.match(new RegExp(input, "i"));
      
        return nameMatch || emailMatch;
      })
      setSearchFriends(results)
      
    };
   
    const handleClick= async(user)=>{
      
    const userId=user._id
    setActiveChat(user)
    const {data}=await axios.post('/api/chat',{userId} )
    // console.log(data)
    setCurrentChat(data) 
        
    const chatExist=chats.some(chat => chat.users.some(user => user._id === userId));
    // console.log(currentChat)
    if(!chatExist){
      setChats([...chats, data ])
    }  
    }
   
  
  return (
    <div
          className={`col-3 users-slide ${
            sidebarOpen ? `users-slide-visible` : ``
          } `}
        >
          <div className="left-side">
            <div className="slide-top">
              <div className="icon" onClick={closeSidebar}>
                <FaArrowLeft />
              </div>
              <h2>New Chat</h2>
            </div>
            <div className="search-bar">
              <div className="search">
                <input
                  type="text"
                  placeholder="search user.."
                  className="search-control"
                  value={search}
                  onChange={handleChange}
                />
                <button onClick={handleSubmit}>
                  <FaSearch />
                </button>
              </div>
            </div>

            <div className="users">
              {searchFriends && searchFriends.length>0 ? (
                searchFriends.map((user) => (
                  <div
                    onClick={()=>handleClick(user)}
                    className={
                      activeChat._id == user._id
                        ? "hover-user active"
                        : "hover-user"
                    }
                    key={user._id}
                  >
                    <Users user={user} />
                  </div>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
  )
}

export default Sidebar
