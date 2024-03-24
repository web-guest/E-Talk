import React from 'react'
import './users.css'
import image from '../../styles/salute.jpg'
function Users({user}) {
  return (
    <div className="user">
        <div className="profile-image">
            <div className="image">
                <img src={user.pic} alt="" />
            </div>
        </div>
        <div className="user-name">
            <span>{user.name}</span>
        </div>
    </div>
  )
}

export default Users
