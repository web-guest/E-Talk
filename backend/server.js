const express= require("express")
const dotenv= require("dotenv")
const path= require('path')
const http=require("http")
const userRouter=require('./Routers/userRouter')
const messengerRouter= require('./Routers/messengerRouter')
const uploadRouter=require('./Routers/uploadRouter')
const db= require('./Config/db')
const Chat=require('./Modals/chatModal')
const cookieParser=require('cookie-parser')
const {notFound, errorHandler}=require('./Middleware/errorHandle')
const Message = require("./Modals/messageModal")
const Notification=require("./Modals/notificationModal")
dotenv.config()
const app=express()
// const server=http.createServer(app)
db()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
__dirname=path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use("/api/users",userRouter)
app.use("/api/chat", messengerRouter)
app.use("/api/uploads", uploadRouter )
app.get("/", (req, res)=>{
    res.send("welcome")
})

app.use(notFound)
app.use(errorHandler)

const server=app.listen(process.env.PORT, ()=>{
    console.log(`server is running on port ${process.env.PORT}` )
})

const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
})
io.on("connection", (socket)=>{

    socket.on("setup", (userData)=>{
        socket.join(userData._id)

        socket.emit("connected")    
    })
    socket.on("join chat", (room)=>{
      socket.join(room)
      console.log("User joined room: "+room)
    })
    socket.on("typing", (room)=>socket.in(room).emit("typing"))
    socket.on("stop typing", (room)=>socket.in(room).emit("stop typing"))
    socket.on('new message', (newMessage)=>{
        var chat= newMessage.chat
        
        if(!chat.users) return console.log("chat.users not defined");
        
        chat.users.forEach(user => {
            
            if(user._id==newMessage.sender._id) return;
            console.log(user._id)
            socket.in(user._id).emit("message recieved", newMessage)

        });
    })
    socket.on('create-group', (data)=>{
        var groupUsers=data.users
        if(!data.users) return console.log("data.users not defined");
         groupUsers.forEach(user=>{
            if(user._id==data.groupAdmin._id) return;
            socket.in(user._id).emit("group-created", data)
         })
    })
    socket.on('remove user', (data)=>{
        
        var groupUsers=data.users
        if(!data.users) return console.log("data.users not defined");
         groupUsers.forEach(user=>{
            if(user._id==data.data.messageData.sender._id) return;
            // console.log(user._id)
            socket.in(user._id).emit("user-removed", data.data)
         })
})
socket.on("set notification", async(data)=>{
    console.log("done-1")
    const userId=data.userId
    const chatId=data.chatId
    let chat = await Chat.findById(chatId).populate("usersNotifi");
    let userNotification = chat.usersNotifi.find(notification => notification.user.equals(userId));
    console.log("done-2")
    if (userNotification) {
                userNotification.notifiNo = (parseInt(userNotification.notifiNo) + 1).toString();
                await userNotification.save();
                
            } else {
                let newNotification = new Notification({
                    user: userId,
                    notifiNo: "1" 
                });
                await newNotification.save();
                chat.usersNotifi.push(newNotification);
                await chat.save();}
                
})
})