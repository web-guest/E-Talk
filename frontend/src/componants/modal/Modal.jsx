import React, { useEffect, useState } from "react";
import "./modal.css";
import { ChatState } from "../../context/ChatProvider";
import { MdCancel } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
function Modal({ isOpen, onClose, socket, children }) {
  const { friends,chats, setChats } = ChatState();
  const [searchUsers, setSearchUsers] = useState("");
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSearch = async (input) => {
    setSearchUsers(input);
    if (input !== "") {
      const results = friends.filter((friend) => {
        const nameMatch =
          friend.name && friend.name.match(new RegExp(input, "i"));
        const emailMatch =
          friend.email && friend.email.match(new RegExp(input, "i"));

        return nameMatch || emailMatch;
      });
      setUsers(results);
    } else {
      setUsers("");
    }
  };
  const addUser = (user) => {
    const userExists = selectedUsers.some((u) => u._id === user._id);

    // Add the new user only if it doesn't already exist
    if (!userExists) {
      setSelectedUsers([...selectedUsers, user]);
      
    }
  };

  const removeUser = (userId) => {
   
    const updatedUsers = selectedUsers.filter((user) => user._id !== userId);
    setSelectedUsers(updatedUsers);
  };
  const createGroup = async (e) => {
   
    const usersId = selectedUsers.map((user) => user._id);
    
    e.preventDefault();
    if (selectedUsers.length < 2) {
      toast.error("add atleast two users");
    } else {
      const groupData = {
        name: groupName,
        users: usersId,
      };
      await axios
        .post("/api/chat/group", groupData)
        .then(({data}) =>{
        toast.success("Group created")
        setChats([data, ...chats])
        setUsers("")
        setSelectedUsers([])
        setGroupName("")
        setSearchUsers("")
        socket.emit('create-group', data)
        // onclose()
        })
        .catch((err) => toast.error(err.response.data.message || err.message));
    }
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={onClose}>
              &times;
            </span>
            {children}
            <div className="group">
              <form className="form-group">
                <input
                  type="text"
                  value={groupName}
                  placeholder="Group Name"
                  onChange={(e) => setGroupName(e.target.value)}
                  className="group-form-input"
                />
                <input
                  type="text"
                  value={searchUsers}
                  placeholder="add User"
                  onChange={(e) => handleSearch(e.target.value)}
                  className="group-form-input"
                />
              </form>
            </div>
            {selectedUsers.length > 0 && (
              <div className="group-users">
                {selectedUsers.map((user) => (
                  <div className="group-user" key={user._id}>
                    <div className="profile-image">
                      <img src={user.pic} alt="" />
                    </div>
                    <div className="name">
                      <p>{user.name}</p>
                    </div>
                    <div className="icon" onClick={() => removeUser(user._id)}>
                      <MdCancel />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {users && (
              <div className="searched-users">
                {users.map((user) => (
                  <div
                    className="user"
                    key={user._id}
                    onClick={() => addUser(user)}
                  >
                    <div className="user-image">
                      <img src={user.pic} alt="" />
                    </div>
                    <div className="user-data">
                      <span>{user.name}</span>
                      <span>Email:{user.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={(e) => createGroup(e)} className="btn">
              Create Group
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
