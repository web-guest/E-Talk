import React from 'react'
import './activeUsers.css'
import image from '../../styles/salute.jpg'
function ActiveUsers({setCurrentChat, user}) {
  return (
    <div onClick={()=>setCurrentChat({
      _id:user.userInfo._id,
      email: user.userInfo.email,
      name: user.userInfo.name
    })} className="active-user">
        <div className="image-active-icon">
            <div className="image">
                <img src={image} alt="" />
                <div className="active-icon"></div>
            </div>
        </div>
    </div>
  )
}

export default ActiveUsers
