import React, { useEffect, useRef, useState } from "react";
import "./home.css";
import {
  FaEllipsisV,
  FaEdit,
  FaSearch,
  FaPlus,
  FaArrowLeft,
  FaUserFriends,
} from "react-icons/fa";
import image from "../../styles/salute.jpg";
import ActiveUsers from "../activeUsers/ActiveUsers";
import { io } from "socket.io-client";
import Users from "../users/Users";
import RightSide from "../rightSide/RightSide";
import Sidebar from "../sidebar/Sidebar";
import Modal from "../modal/Modal";
import Chat from "../Chats/Chat";
import { ChatState } from "../../context/ChatProvider";
import { FaArrowCircleRight } from "react-icons/fa";

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../spinner/Spinner";
import ProfileSideBar from "../profileSidebar/ProfileSideBar";
import ViewPhoto from "../viewPhoto/ViewPhoto";

const ENDPOINT = "http://localhost:5000";

var socket, selectedChatCompare;

function Home() {
  // var socket, selectedChatCompare;
  // const socket = useRef();
  // const scrollRef=useRef()
  const [menu, setmenu] = useState(false);
  const { user, notification, setNotification, setFriends, setAllFriends, chats, setChats, isLogin } = ChatState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [activeUser, setActiveUser] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [userInfo] = useState([]);
  const [data] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilesidebarOpen, setProfileSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [navigate]);
  //frontend controller functions

  const opensidebar = () => {
    setSidebarOpen(true);
  };
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  const openProfilesidebar = () => {
    setProfileSidebarOpen(true)
  };
  const closeProfileSidebar = () => {
    setProfileSidebarOpen(false)
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const logoutHandle = async (e) => {
    e.preventDefault();
    if (window.confirm("are you sure, want to logout?")) {
      await axios.post("/api/users/logout");
      localStorage.removeItem("userInfo");

      navigate("/login");
    }
  };

  // useEffects
  useEffect(() => {
    socket = io(ENDPOINT);
    if (user) {
      socket.emit("setup", user);
      socket.on("connected", () => {
        setSocketConnected(true);
      });
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }
  }, [user]);

  useEffect(() => {
    async function fetchChats() {
      setIsChatLoading(true);
      const { data } = await axios.get(`/api/chat`);
      const sortedChats = data.sort((a, b) => {
        const aLatestTimestamp = a.latestMessage ? a.latestMessage.createdAt : 0;
        const bLatestTimestamp = b.latestMessage ? b.latestMessage.createdAt : 0;
        return bLatestTimestamp - aLatestTimestamp;
      });
      setChats(sortedChats);
      setIsChatLoading(false);
    }
    fetchChats();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(`/api/users`);
      setFriends(data);
      setAllFriends(data);
    }
    fetchData();
  }, []);

  const fetchMessages = async () => {
    if (!currentChat) return;
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/api/chat/${currentChat._id}`);

      setMessages(data);
      setIsLoading(false);
      socket.emit("join chat", currentChat._id);
    } catch (err) {
      toast.error("failed to load chats");
    }
  };

  //socket
  const setchatAtTop= async(newMessage)=>{
    setChats((prevChats) => {
        
      const chatIndex = prevChats.findIndex(
        (chat) => chat._id === newMessage.chat._id
      );
      // console.log(chatIndex)
      if(chatIndex>=0){
        const updatedChats = [
          { ...prevChats[chatIndex], latestMessage: newMessage },
          ...prevChats.slice(0, chatIndex),
          ...prevChats.slice(chatIndex + 1),
        ];
        return updatedChats;
      }
      else{
        var chat=newMessage.chat
        chat.latestMessage=newMessage
        const updatedChats = [chat, ...prevChats];
        return updatedChats;
      }
        
      
      
      
    });
  } 

  const setShow = () => {
    setmenu(!menu);
  };

  const inputHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", currentChat._id);
    }
    let lastTypingTime = new Date().getTime();
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= 3000 && typing) {
        socket.emit("stop typing", currentChat._id);
        setTyping(false);
      }
    }, 3000);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage !== "") {
      socket.emit("stop typing", currentChat._id);
      setTyping(false);
      const content = newMessage;
      const chatId = currentChat._id;
      setNewMessage("");
      const { data } = await axios.post("/api/chat/messageSend", {
        content,
        chatId,
      });
      setchatAtTop(data)

      socket.emit("new message", data);
      setMessages([...messages, data]);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = currentChat;
  }, [currentChat]);
  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      console.log(newMessage)
      setchatAtTop(newMessage)
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        const userId=user._id
        const chatId=newMessage.chat._id
        
       socket.emit("set notification", {userId, chatId})
        
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });
  useEffect(()=>{
     socket.on('user-removed', (data)=>{
      setchatAtTop(data.messageData)
      const chatIndex = chats.findIndex(chat=> chat._id === data.removed._id)
      if (chatIndex !== -1){
        chats[chatIndex].prevUsers= data.removed.prevUsers;
        chats[chatIndex].users= data.removed.users;
        setChats([...chats])
      }
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== data.removed._id
      ) {
        console.log("hey")
      } else {
        console.log("hello")
       
        setMessages([...messages, data.messageData]);
      }
    })
  })
  useEffect(() => {
    socket.on("group-created", (data) => {
        setChats([data, ...chats])
    });
  });
  // const chatdata = {
  //   sender_name: userInfo.name,
  //   receiver_id: currentChat._id,
  //   message: {
  //     text: newMessage,
  //     image: "",
  //   },
  // };
  // socket.current.emit("sendMessage", {
  //   sender_id: userInfo._id,
  //   sender_name: userInfo.name,
  //   receiver_id: currentChat._id,
  //   time: new Date(),
  //   message: {
  //     text: newMessage,
  //     image: "",
  //   },
  // });
  // try {
  //   // const res = await message(chatdata).unwrap();
  // } catch (error) {
  //   console.log(error);
  // }

  return (
    <div className="container">
      <div className="messenger">
        <div className="row">
          {/* <ViewPhoto/> */}
          <Sidebar
            sidebarOpen={sidebarOpen}
            closeSidebar={closeSidebar}
            currentChat={currentChat}
            setCurrentChat={setCurrentChat}
          />
          
          <ProfileSideBar
          profilesidebarOpen={profilesidebarOpen}
          closeProfileSidebar={closeProfileSidebar}/>
          <div
            className={`col-3 main-left ${sidebarOpen || profilesidebarOpen ? `main-left-hide` : ``}`}
          >
            
            <div className="left-side">
              <div className="top">
                <div className="image-name">
                  <div className="image" onClick={openProfilesidebar}>
                    {user && <img src={user.pic} alt="" />}
                  </div>
                  <div className="name">
                    <h1></h1>
                  </div>
                </div>
                <div className="icons">
                  <div className="group-icon" onClick={openModal}>
                    <div className="icon">
                      <FaUserFriends />
                    </div>
                  </div>
                  <div className="search-icon" onClick={opensidebar}>
                    <div className="icon">
                      <FaSearch />
                    </div>
                  </div>
                  <div className="option-icon">
                    <div className="icon" onClick={setShow}>
                      <FaEllipsisV />
                    </div>
                    <div
                      className={`logout ${menu ? `show-menu` : `hide-menu`}`}
                    >
                      <button className="logut" onClick={logoutHandle}>
                        Logout
                      </button>
                    </div>
                  </div>
                  <Modal isOpen={isModalOpen} onClose={closeModal} socket={socket}>
                    <h2>Add Group Perticipet</h2>
                  </Modal>
                </div>
              </div>
              <div className="search-bar">
                <div className="search">
                  <input
                    type="text"
                    placeholder="search.."
                    className="search-control"
                  />
                  <button>
                    <FaSearch />
                  </button>
                </div>
              </div>
              <div className="active-users">
                {activeUser && activeUser.length > 0
                  ? activeUser.map((u) => (
                      <ActiveUsers setCurrentChat={setCurrentChat} user={u} />
                    ))
                  : ""}
              </div>
              <div className="users">
                {isChatLoading ? (
                  <Spinner width={40} height={40} />
                ) : chats.length > 0 ? (
                  chats.map((chat) => (
                    <div
                      onClick={() => setCurrentChat(chat)}
                      className={
                        currentChat._id == chat._id
                          ? "hover-user active"
                          : "hover-user"
                      }
                      key={chat._id}
                    >
                      <Chat chat={chat} />
                    </div>
                  ))
                ) : (
                  <div>you have no chat</div>
                )}
              </div>
            </div>
            
          </div>

          {currentChat ? (
            <RightSide
              chat={currentChat}
              newMessage={newMessage}
              inputHandler={inputHandler}
              sendMessage={sendMessage}
              activeUser={activeUser}
              messages={messages}
              setMessages={setMessages}
              isLoading={isLoading}
              isTyping={isTyping}
              socket={socket}
              // scrollRef={scrollRef}
            />
          ) : (
            "start chat"
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
