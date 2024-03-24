// const formidable=require('formidable')
const User= require('../Modals/userModel')
const fs=require('fs')
const generateToken=require('../utils/generateToken')
const asyncHandler= require('../Middleware/asyncHandler')

exports.getUsers= asyncHandler(async (req, res) => {
     console.log(req.query.search)
     const keyword = req.query.search
       ? {
           $or: [
             { name: { $regex: req.query.search, $options: "i" } },
             { email: { $regex: req.query.search, $options: "i" } },
           ],
         }
       : {};
   
     const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
     res.send(users);
     
   });

exports.registration= asyncHandler(async(req, res)=>{
     const {name, email, password}=req.body
     const emailExist= await User.findOne({email})
     if(emailExist){
         res.status(400);
         throw new Error('email already registerd!')
         }
        const user=  await User.create({name, email, password})
        if(user){
             generateToken(res, user._id)
             res.status(201).json({
             _id: user._id,
             name: user.name,
             email: user.email,
             isAdmin: user.isAdmin,
             pic: user.pic
             })
        }
        else{
             res.status(400).json({err: 'User not found'})
        }
})

exports.login= asyncHandler(async(req, res)=>{
     
      const {name, password}=req.body;
         const user= await User.findOne({name});
         if(user && (await user.matchPassword(password))){
            generateToken(res, user._id)
            res.status(201).json({
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  isAdmin: user.isAdmin,
                  pic: user.pic
                  })
             }
             else{
                  res.status(400).json({err: 'invalid username/password'})
             }
         })

exports.logoutUser= asyncHandler(async(req, res)=>{
          res.cookie('jwt', '', {
              httpOnly: true,
              expires: new Date(0)
          });
          res.status(200).json({message: 'Logged out successfully'})
      }
)

exports.updateProfilepic= asyncHandler(async(req, res)=>{
    const pic= `/${req.file.path}`
    const id=req.body.id
   
    const updatedpic = await User.findByIdAndUpdate(
     id,
     {
       pic:pic,
     },
     {
       new: true,
     }).select('pic')
     if(updatedpic){
      console.log(updatedpic)
      res.status(201).json(updatedpic);
     }
     else{
      res.status(400);
      throw new Error(error.message);

     }
    

})
exports.getUser=asyncHandler(async(req, res)=>{
    const userId=req.params.id
    const user=await User.findById(userId).select('-password')
    if(user){

      res.json(user)
    }
    else{
      
        res.status(400).json({err: 'User not found'})
   
    }
})
exports.updateUserName=asyncHandler(async(req,res)=>{
  console.log("hello")
  const userId=req.params.id
  const newName= req.body.editName
  const user= await User.findByIdAndUpdate(userId, {name:newName},{new: true}).select('name')
  console.log(user)
  if(user){
   res.json(user)
  }else{
    res.status(400).json({err: 'there is some problem in server, please try again'})
  }
})