//import mongoose models
var roomModel = require("../models/room")
var chatModel = require("../models/chat")

//export 4 functions i.e create,read,update,delete
module.exports = {
  createChat: createChat,
  getAllChatsByRoomId: getAllChatsByRoomId,
  getAllChats: getAllChats,
  deleteChat: deleteChat,
}

async function createChat(data) {
  var details = new chatModel()
  details.roomId = data.roomId
  details.createdAt = data.createdAt
  details.chatType = data.chatType
  details.members = data.members
  details.fromId = data.fromId
  details.fromName = data.fromName
  details.message = data.message

  try {
    let result = await details.save()
    return result
  } catch (err) {
    if (err.message) {
      throw err.message
    } else {
      throw err
    }
  }
}

async function getAllChats(data) {
  try {
    let result = await chatModel
      .find({})
      .populate({ model: roomModel, path: "roomId", select: "roomName users" })
      .sort({ createdAt: 1 })
    return result
  } catch (err) {
    throw err
  }
}

async function getAllChatsByRoomId(data) {
  try {
    let result = await chatModel
      .find({ roomId: data.roomId })
      .populate({ model: roomModel, path: "roomId", select: "roomName users" })
      .sort({ createdAt: 1 })
    return result
  } catch (err) {
    throw err
  }
}

async function deleteChat(data) {
  console.log("deleteChat", data)
  try {
    let result = await chatModel.deleteOne({ _id: data._id })
    return result
  } catch (err) {
    throw err
  }
}
