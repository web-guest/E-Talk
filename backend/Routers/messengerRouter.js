const express=require("express")
const router=express.Router();
const {isLogin}= require('../Middleware/authMiddleware')
const {saveMessage, createGroupChat, fetchChats, accessChat,renameGroup, removeUser, allMessages, deleteGroup }=require('../controllers/messageController')

// router.get('/',isLogin, getUsers)
router.post('/messageSend', isLogin, saveMessage )
router.get('/:chatId', isLogin, allMessages)
// router.get('/messages/:id', isLogin, getMessages)

router.route('/group').post(isLogin, createGroupChat).put(isLogin,renameGroup)
router.route('/').get(isLogin, fetchChats).post(isLogin, accessChat);
router.post('/removeUser', isLogin, removeUser )
router.post('/deleteGroup', isLogin, deleteGroup )
module.exports=router