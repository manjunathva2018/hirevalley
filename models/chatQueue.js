var mongoose = require("mongoose")
const Schema = mongoose.Schema
//schema
var chatQueueSchema = new mongoose.Schema({
  payload: {
    type: Schema.Types.Mixed,
    required: true,
  },
  ack: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  deleted: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    unique: true,
  },
})

// compile schema to model
module.exports = mongoose.model("chatQueues", chatQueueSchema, "chatQueues")
