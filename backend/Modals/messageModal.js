const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    groupNotice: {type:Boolean, default: false},
    notice: {
      noticetype:{type: "String"},
      noticeTo:{type:mongoose.Schema.Types.ObjectId, ref: "User"}},
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
messageSchema.methods.markAsReadBy = function (userId) {
  if (!this.readBy.includes(userId)) {
    this.readBy.push(userId);
    return this.save();
  } else {
    return Promise.resolve(this);
  }
};

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;