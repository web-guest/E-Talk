import React from 'react'
import './rightSide.css'
import {FaPhone, FaVideo,FaInfoCircle} from 'react-icons/fa'
import image from '../../styles/salute.jpg'
import ChatBox from '../chatBox/ChatBox'
import SendMessage from '../sendMessage/SendMessage'
import Info from '../info/Info'
import { ChatState } from '../../context/ChatProvider'

function RightSide(props) {
    const {user}=ChatState()
    const {chat, newMessage, inputHandler, sendMessage, activeUser, messages,setMessages, isLoading, isTyping, socket}=props
    const isGroupUser= chat.users.some(u=>u._id===user._id)
    
    const friend=chat.users.filter(u=>u._id !==user._id)[0]

  return (
    <div className="col-9">
        <div className="right-side">
            <input type="checkbox" id='dot' />
            <div className="row">
                <div className="col-8">
                    <div className="message-section">
                        <div className="header">
                            <div className="image-name">
                                <div className="image">
                                    <img src={chat.isGroupChat? chat.pic : friend.pic} alt="" />
                                    {/* {activeUser && activeUser.length>0 && activeUser.some(u=>u.userId===friend._id) ? <div className="active-icon"></div> : ''} */}
                                </div>
                                <div className="name">
                                    {chat.isGroupChat? chat.chatName : friend.name}
                                </div>
                            </div>
                            <div className="icons">
                                <div className="icon">
                                    <FaPhone/>
                                </div>
                                <div className="icon">
                                    <FaVideo/>
                                </div>
                                <div className="icon">
                                    <label htmlFor="dot"><FaInfoCircle/></label>
                                </div>
                            </div>
                        </div>
                        <ChatBox messages={messages} isLoading={isLoading} isTyping={isTyping} chat={chat} />
                        {isGroupUser? <SendMessage
                        newMessage={newMessage}
                        inputHandler={inputHandler}
                        sendMessage={sendMessage}
                        /> : <div className='not-user'>you are no longer perticipant in this group </div>}
                    </div>
                </div>
                <div className="col-4 dot">
                <Info chat={chat} isGroupUser={isGroupUser} setMessages={setMessages} messages={messages} socket={socket}
                />
                </div>
            </div>
        </div>
    </div>
  )
}
export default RightSide
