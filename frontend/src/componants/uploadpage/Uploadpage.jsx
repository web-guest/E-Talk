import React,{useEffect, useState} from 'react'
import './uploadpage.css'
import {FaForward} from 'react-icons/fa'
import axios from 'axios';
import {toast} from 'react-toastify'
import { ChatState } from '../../context/ChatProvider';
import { useNavigate } from 'react-router-dom';
function Uploadpage() {
  const {user, setUser}=ChatState()
  const [image, setImage] = useState("");
  const [loadImage, setLoadImage] = useState("");
  const navigate= useNavigate()

  
  const imageUploadHandle=async(e)=>{
    
    e.preventDefault()
    const formData = new FormData();
    formData.append("image", image);
    formData.append("id", user._id )
    
      axios.post('/api/uploads', formData).then(user=>{
        setUser((prevUser) => ({
          ...prevUser,
          pic: user.data.pic,
        }));
      }).catch(err=>{
        toast.error(err?.data?.message || err.error);
      }).finally(()=>{
        navigate('/')
      })
      
     
  }

   const imageHandler = (e) => {
    e.preventDefault();
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    const reader = new FileReader();
    reader.onload = () => {
      setLoadImage(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  return (
    <div className="upload-image">
        <div className="header">
            SET PROFILE PICTURE
        </div>
        <div className="set-image">
            
        {loadImage && <img src={loadImage} alt="" />}
        </div>
        <div className="file">
                  <label htmlFor="image">Select Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    defaultValue={image}
                    onChange={(e) => imageHandler(e)}
                  />
                </div>
        <button className="next" onClick={imageUploadHandle}>
          Next <FaForward/>
        </button>
    </div>
  )
}

export default Uploadpage
