//import the crud operation functions
var chatDetails = require("../crud/chatCrud")
const colors = require("./../constants/colors")

module.exports.createChatDetails = async function (req, res) {
  var data = req.body
  try {
    let chatData = await chatDetails.createChat(data)
    // console.log(colors.green, `createChatDetails:${chatData}`)
    //send status code 200 i.e ok  with json object
    res.status(200).json({ status: true, chatData: chatData })
  } catch (err) {
    console.log(colors.red, `createChatDetails err ${err}`)
    //send status code 400 i.e error with json object
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.getAllChatDetails = async function (req, res) {
  var data = {}
  try {
    let chatData = await chatDetails.getAllChats(data)
    // console.log(colors.green, `getAllChatDetails ${chatData}`)
    res.status(200).json({ status: true, chatData: chatData })
  } catch (err) {
    console.log(colors.red, `getAllChatDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.getAllChatsByRoomDetails = async function (req, res) {
  var data = { roomId: req.params.roomId }
  try {
    let chatData = await chatDetails.getAllChatsByRoomId(data)
    // console.log(colors.green, `getAllChatsByRoomDetails ${chatData}`)
    res.status(200).json({ status: true, chatData: chatData })
  } catch (err) {
    console.log(colors.red, `getAllChatsByRoomDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.deleteChatDetails = async function (req, res) {
  var data = { _id: req.params.id }
  try {
    let chatData = await chatDetails.deleteChat(data)
    // console.log(colors.green, `deleteChatDetails ${chatData}`)
    res.status(200).json({ status: true, chatData: chatData })
  } catch (err) {
    console.log(colors.red, `deleteChatDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}
