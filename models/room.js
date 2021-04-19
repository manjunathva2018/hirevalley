var mongoose = require("mongoose")
const Schema = mongoose.Schema
//schema
var roomSchema = new mongoose.Schema({
  namespace: {
    type: String,
    required: true,
  },
  issue: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  roomType: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
    unique: true,
  },
  messagesCount: {
    type: Number,
    required: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: false,
  },
  users: {
    type: [Schema.Types.Mixed],
    required: false,
  },
})
// compile schema to model
module.exports = mongoose.model("rooms", roomSchema, "rooms")
