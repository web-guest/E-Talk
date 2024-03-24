import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import "./register.css";
import { toast } from "react-toastify";
import validator from "validator";

function Register({ currentFriend }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // const [image, setImage] = useState("");
  // const [loadImage, setLoadImage] = useState("");
  const { user, setUser, isLogin } = ChatState();
  const navigate = useNavigate();

  useEffect(()=>{
    if(isLogin){
      navigate('/')
    }
  },[navigate,isLogin])
 

  const submitHandler = async (e) => {
    try {
     
      e.preventDefault();
      if (password !== confirmPassword) {
        console.log("error");
        toast.error("password and confirm password should be same");
        return;
      }
      if (!validator.isEmail(email)) {
        toast.error("please, enter an valid email!");
      } else {
        
        const { data } = await axios.post(
          "/api/users/register",
          { name, email, password},
        );

        localStorage.setItem("userInfo", JSON.stringify(data));
        setUser(data);
        navigate("/upload-profile");
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  // const imageHandler = (e) => {
  //   e.preventDefault();
  //   const selectedImage = e.target.files[0];
  //   setImage(selectedImage);
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     setLoadImage(reader.result);
  //   };
  //   reader.readAsDataURL(e.target.files[0]);
  // };

  return (
    <>
      <div className="form-container">
        <div className="form-header">REGISTER</div>
        <div className="form-body">
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="username.."
                id="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="email.."
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="password.."
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password.."
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {/* <div className="form-group">
              <div className="file-image">
                <div className="image">
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
              </div>
            </div> */}

            <div className="form-group">
              <input type="submit" value="register" className="btn" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
