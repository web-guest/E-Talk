const jwt =require('jsonwebtoken')
const asyncHandler=require("./asyncHandler")
const User =require("../Modals/userModel")
exports.isLogin=asyncHandler(async(req, res, next)=>{
  let token;
  token= req.cookies.jwt
  if(token){
    try {
      const decode=jwt.verify(token, process.env.JWT_SECRET);
      req.user= await User.findById(decode.userId).select('-password')
      next()
      
    } catch (error) {
    res.status(401);
    throw new Error('not Authorized, token failed')
    }
  }
})
