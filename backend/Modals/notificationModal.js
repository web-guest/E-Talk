const mongoose = require("mongoose");

const notificationModel = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notifiNo: { type: String, default: "0" },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationModel);

module.exports = Notification;
