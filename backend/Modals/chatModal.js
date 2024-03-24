const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    pic: {type:String, required: true, default: "https://www.tenniscall.com/images/chat.jpg"},
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    prevUsers:[{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    usersNotifi:[{type:mongoose.Schema.Types.ObjectId, ref: "Notification"}],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;

