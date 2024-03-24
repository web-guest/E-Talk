const Chat = require("../Modals/chatModal");
const User = require("../Modals/userModel");
const Message = require("../Modals/messageModal");
const asyncHandler = require("../Middleware/asyncHandler");

// reusable methods
const saveSingleMessage=async(newMessage, chatId)=>{
  try{
  var message = await Message.create(newMessage);
  await message.markAsReadBy(newMessage.sender);
  
  const populatedMessage = await Message.findById(message._id)
    .populate("sender", "name pic")
    .populate("chat")
    .exec();

  const fullyPopulatedMessage = await User.populate(populatedMessage, {
    path: "chat.users",
    select: "name pic email",
  });
  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: fullyPopulatedMessage,
  });
  return fullyPopulatedMessage;
}
  catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}

// chat controllers
exports.accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

exports.createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = req.body.users;

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

exports.fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({
      $or: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { prevUsers: { $elemMatch: { $eq: req.user._id } } },
      ],
    })
      .populate("users", "-password")
      .populate("prevUsers", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        
        console.log(results)
        res.status(201).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

exports.renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

exports.removeUser = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removerId= req.user.id

  
  var newMessage = {
    sender: removerId,
    groupNotice: true,
    notice: {
      noticetype:"remove",
      noticeTo: userId},
    chat: chatId,
  };
  
   
  var messageData= await saveSingleMessage(newMessage, chatId)
  messageData=await User.populate(messageData, {
    path:"notice.noticeTo",
    select: "name email",
})
  
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
      $push: { prevUsers: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  
  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json({removed, messageData});
  }
});

//message controllers


exports.getMessages = asyncHandler(async (req, res) => {
  try {
    var messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
      const fullmessages = messages.map(async (message) => {
        if(!message.groupNotice) return;
        return await User.populate(message, {
          path: "notice.noticeTo",
          select: "name email",
        });
      });
    res.json(fullmessages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

exports.saveMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  
  if (!content || !chatId) {
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

   const fullyPopulatedMessage= await saveSingleMessage(newMessage, chatId)
   

    res.json(fullyPopulatedMessage);

    // message = await message.populate("sender", "name pic").populate("chat").exec();
    // message = await User.populate(message, {
    //   path: "chat.users",
    //   select: "name pic email",
    // });

    // await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    // res.json(message);
  
});

exports.allMessages = asyncHandler(async (req, res) => {
  try {
    
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
      const fullmessages = await Promise.all(messages.map(async (message) => {
        const m = await User.populate(message, {
          path: "notice.noticeTo",
          select: "name email",
        });
        return m;
      }));
      
    res.json(fullmessages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
exports.deleteGroup = asyncHandler(async (req, res) => {
  console.log("deleteUser");
});
