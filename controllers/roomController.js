//import the crud operation functions
var roomDetails = require("../crud/roomCrud")
const colors = require("./../constants/colors")

module.exports.createRoomDetails = async function (req, res) {
  var data = req.body
  try {
    let roomData = await roomDetails.createRoom(data)
    // console.log(colors.green, `createRoomDetails:${roomData}`)

    res.status(200).json({ status: true, roomData: roomData })
  } catch (err) {
    console.log(colors.red, `createRoomDetails err ${err}`)

    res.status(400).json({ status: false, error: err })
  }
}

module.exports.getAllRoomDetails = async function (req, res) {
  var data = {}
  try {
    let roomData = await roomDetails.getAllRooms(data)
    // console.log(colors.green, `getAllRoomDetails ${roomData}`)
    res.status(200).json({ status: true, roomData: roomData })
  } catch (err) {
    console.log(colors.red, `getAllRoomDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.getAllRoomByNamespaceDetails = async function (req, res) {
  var data = { namespace: req.params.namespace }
  try {
    let roomData = await roomDetails.getAllRoomsByNamespace(data)
    // console.log(colors.green, `getAllRoomByNamespaceDetails ${roomData}`)
    res.status(200).json({ status: true, roomData: roomData })
  } catch (err) {
    console.log(colors.red, `getAllRoomByNamespaceDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.getOneRoomDetails = async function (req, res) {
  var data = { _id: req.params.id }
  try {
    let roomData = await roomDetails.getSingleUser(data)
    // console.log(colors.green, `getOneRoomDetails ${roomData}`)
    res.status(200).json({ status: true, roomData: roomData })
  } catch (err) {
    console.log(colors.red, `getOneRoomDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.updateRoomUserDetails = async function (req, res) {
  var data = req.body
  data._id = data.id

  try {
    let roomData = await roomDetails.updateRoomUsers(data)
    // console.log(colors.green, `updateRoomUserDetails: ${roomData}`)
    res.status(200).json({ status: true, roomData: roomData })
  } catch (err) {
    console.log(colors.red, `updateRoomUserDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.deleteRoomDetails = async function (req, res) {
  var data = { _id: req.params.id }
  try {
    let roomData = await roomDetails.deleteRoom(data)
    // console.log(colors.green, `deleteRoomDetails ${roomData}`)
    res.status(200).json({ status: true, roomData: roomData })
  } catch (err) {
    console.log(colors.red, `deleteRoomDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}
