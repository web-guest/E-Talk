import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaCamera, FaEdit, FaCheck } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import "./profileSideBar.css";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function ProfileSideBar({ profilesidebarOpen, closeProfileSidebar }) {
  const { user, setUser } = ChatState();
  const navigate=useNavigate()
  const [editMailClick, seteditMailClick] = useState(false);
  const [editNameClick, seteditNameClick] = useState(false);
  const [editEmail, setEditEmail] = useState();
  const [disable, setDisable] = useState(false);
  const [editName, setEditName] = useState();
  const [openOptions, setOpenOptions] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(false);
  // useEffect(()=>{
  //   seteditMailClick(false)
  // }, [seteditMailClick])

  const editMailHandle = async (e) => {
    seteditMailClick(true);
    setEditEmail(user.email);
  };
  const cancelEditEmailHandle = async () => {
    seteditMailClick(false);
  };
  const editNameHandle = async (e) => {
    seteditNameClick(true);
    setEditName(user.name);
  };
  const cancelEditNameHandle = async () => {
    seteditNameClick(false);
  };
  const submitEditNameHandle = async () => {
    setDisable(true);
    if (user) {
      axios
        .put(`/api/users/${user._id}`, { editName })
        .then((user) => {
          setUser((prevUser) => ({
            ...prevUser,
            name: user.data.name,
          }));
          toast.success("your name updated");
        })
        .catch((err) => {
          console.log(err);
          toast.error(err?.data?.message || err.error);
        })
        .finally(() => {
          setDisable(false);
          seteditNameClick(false);
        });
    }
  };

  const imageOptionHandle = async (e) => {
    setOpenOptions(!openOptions);
  };
  const viewPhotoHandle = async () => {
    setViewPhoto(true);
  };
  const closephotoHandle = async () => {
    setViewPhoto(false);
  };
  const changePhotoHandle = async () => {
    navigate('/upload-profile')
  };
  
  return (
    <div
      className={`col-3 profileContainer ${
        profilesidebarOpen ? `profileContainer--visible` : ``
      }`}
    >
      {user && (
        <div className="left-side">
          <div className="slide-top">
            <div className="icon" onClick={closeProfileSidebar}>
              <FaArrowLeft />
            </div>
            <h2>Profile</h2>
          </div>
          <div className="profile-photo">
            <div className={viewPhoto ? `view-image` : `image`}>
              <div className="cancel" onClick={closephotoHandle}>
                <FaCircleXmark />
              </div>
              <img src={user.pic} alt="" />
            </div>
            {!viewPhoto && (
              <div className="image-layer" onClick={imageOptionHandle}>
                <span>
                  <FaCamera />
                </span>
                <p>Change Photo</p>
                {openOptions && (
                  <div className="options">
                    <div className="option" onClick={viewPhotoHandle}>
                      View photo
                    </div>
                    <div className="option" onClick={changePhotoHandle}>
                      Change photo
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="other-details">
            <div className="name-detail">
              <p>Name</p>
              <div className={`name ${disable ? `disable` : ``}`}>
                <div className="name-p">
                  {editNameClick ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="name"
                      autoFocus
                    />
                  ) : (
                    user.name
                  )}
                  {editNameClick && (
                    <div className="cross" onClick={cancelEditNameHandle}>
                      {" "}
                      X
                    </div>
                  )}
                </div>
                <div className="icon" onClick={editNameHandle}>
                  {editNameClick ? (
                    <FaCheck onClick={submitEditNameHandle} />
                  ) : (
                    <FaEdit />
                  )}
                </div>
              </div>
            </div>
            <div className="email-detail">
              <p>Email</p>
              <div className="email">
                <div className="email-p">
                  {editMailClick ? (
                    <input
                      type="text"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="email"
                      autoFocus
                    />
                  ) : (
                    user.email
                  )}
                  {editMailClick && (
                    <div className="cross" onClick={cancelEditEmailHandle}>
                      {" "}
                      X
                    </div>
                  )}
                </div>

                <div className="icon" onClick={editMailHandle}>
                  {editMailClick ? <FaCheck /> : <FaEdit />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileSideBar;
