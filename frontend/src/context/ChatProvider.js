import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState([]);
  const [friends, setFriends] = useState([]);
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [allFriends, setAllFriends]=useState([])
  const [isLogin, setIslogin]=useState(false)
  

  const navigate=useNavigate()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setIslogin(userInfo)
    async function fetchData(){
      const {data}= await axios.get(`/api/users/${userInfo._id}`)
      setUser(data)
    }
    if(userInfo){ 
      fetchData()
    }
    
    // if (userInfo!==null) {
    //   navigate('/')
    // }
    // else{
    //   navigate('/login')
    // }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        friends,
        setFriends,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        allFriends,
        setAllFriends,
        isLogin,
        setIslogin
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;