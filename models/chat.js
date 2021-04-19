var mongoose = require("mongoose")
const Schema = mongoose.Schema
//schema
var chatSchema = new mongoose.Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "room",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    unique: true,
  },
  chatType: {
    type: String,
    required: false,
  },
  members: {
    type: [Schema.Types.Mixed],
    required: true,
  },
  fromId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  fromName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
})
// compile schema to model
module.exports = mongoose.model("chatHistories", chatSchema, "chatHistories")
