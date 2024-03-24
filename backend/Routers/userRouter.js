const express=require("express")
const router=express.Router();
const {isLogin}= require('../Middleware/authMiddleware')
const{registration, login, getUsers,logoutUser, getUser, updateUserName}=require('../controllers/userController')

router.post('/register', registration)
router.post('/login', login)
router.post('/logout', logoutUser)
router.get('/', isLogin, getUsers)
router.route('/:id').get(isLogin, getUser).put(isLogin, updateUserName)


module.exports=router