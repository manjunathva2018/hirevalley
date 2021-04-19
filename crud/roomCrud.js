//import mongoose models
var roomModel = require("../models/room")
var userModel = require("../models/user")
var chatModel = require("../models/chat")

//export 4 functions i.e create,read,update,delete
module.exports = {
  createRoom: createRoom,
  getAllRooms: getAllRooms,
  getSingleRoom: getSingleRoom,
  updateRoomUsers: updateRoomUsers,
  deleteRoom: deleteRoom,
  getAllRoomsByNamespace: getAllRoomsByNamespace,
}

async function createRoom(data) {
  // console.log("createUser",data)
  var details = new roomModel()
  details.namespace = data.namespace
  details.issue = data.issue
  details.roomName = data.roomName
  details.roomType = data.roomType
  details.createdAt = new Date()
  details.messagesCount = data.messagesCount
  details.users = data.users
  details.owner = data.owner

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

async function getAllRooms(data) {
  try {
    let result = await roomModel
      .find({})
      .populate({ model: userModel, path: "owner", select: "userName" })
      .sort({ createdAt: 1 })
    return result
  } catch (err) {
    throw err
  }
}

async function getAllRoomsByNamespace(data) {
  try {
    let result = await roomModel
      .find({ namespace: data.namespace })
      .populate({ model: userModel, path: "owner", select: "userName" })
      .sort({ createdAt: 1 })
    return result
  } catch (err) {
    throw err
  }
}

async function getSingleRoom(data) {
  try {
    let result = await userModel.findById({ _id: data._id })
    return result
  } catch (err) {
    throw err
  }
}

async function updateRoomUsers(data) {
  console.log("updateRoomUsers", data)
  try {
    let result = await roomModel.findOneAndUpdate({ _id: data._id }, { users: data.users })
    return result
  } catch (err) {
    throw err
  }
}

async function updateRoom(data) {
  console.log("updateRoom", data)
  try {
    let result = await roomModel.findOneAndUpdate(
      { _id: data._id },
      {
        users: data.users,
        namespace: data.namespace,
        issue: data.issue,
        roomName: data.roomName,
        roomType: data.roomType,
        owner: data.owner,
      }
    )
    return result
  } catch (err) {
    throw err
  }
}

async function queryRoomUser(data) {
  console.log("queryRoomUser", data)
  try {
    let result = await roomModel.find({ "users.userName": data.userName })
    return result
  } catch (err) {
    throw err
  }
}

async function deleteRoom(data) {
  console.log("delete a room with corresponding chats", data)
  try {
    let chatsDeleted = await chatModel.deleteMany({ roomId: data._id })
    let result = await roomModel.deleteOne({ _id: data._id })
    result.chatsDeleted = chatsDeleted
    return result
  } catch (err) {
    throw err
  }
}
