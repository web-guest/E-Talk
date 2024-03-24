import React, { useState } from 'react'
import './sendMessage.css'
import {FaPlusCircle, FaImage, FaGift, FaPaperPlane} from 'react-icons/fa'
function SendMessage({newMessage, inputHandler, sendMessage}) {
    
  return (
    <div className="send-message-section">
        <div className="file">
            <div className="add-attachment hover-attachment">
                Attachment
            </div>
        <FaPlusCircle/>
        </div>
        <div className="file">
            <div className="add-image hover-image">
                Image
            </div>
            <input type="file" id='pic' className='form-control' />
        <label htmlFor="pic"><FaImage/></label>
        </div>
        {/* <div className="file">
        <FaImage/>
        </div> */}
        <div className="file">
            <div className="add-gift hover-gift">
                GIF
            </div>
        <FaGift/>
        </div>
        <div className="message-box">
            <input type="text" name='message' id='message' value={newMessage} onChange={inputHandler} placeholder='Aa' className="form-control" />
            <label htmlFor="emoji">😊</label>
        </div>
        <div className="file" onClick={sendMessage}>
            <FaPaperPlane/>
        </div>
    </div>
  )
}
export default SendMessage
