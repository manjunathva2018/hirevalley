//import the crud operation functions
var chatQDetails = require("../crud/chatQueueCrud")
const colors = require("./../constants/colors")

module.exports.createQDetails = async function (req, res) {
  var data = req.body
  try {
    let chatQData = await chatQDetails.createQ(data)
    console.log(colors.green, `chatQDetails:${chatQData}`)
    res.status(200).json({ status: true, chatQData: chatQData })
  } catch (err) {
    console.log(colors.red, `chatQDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.getAllQDetails = async function (req, res) {
  var data = {}
  try {
    let chatQData = await chatQDetails.getAllQueues(data)
    console.log(colors.green, `getAllQDetails ${chatQData}`)
    res.status(200).json({ status: true, chatQData: chatQData })
  } catch (err) {
    console.log(colors.red, `getAllQDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.getAllPendingQDetails = async function (req, res) {
  var data = {}
  try {
    let chatQData = await chatQDetails.getAllPendingQ(data)
    console.log(colors.green, `getAllPendingQDetails ${chatQData}`)
    res.status(200).json({ status: true, chatQData: chatQData })
  } catch (err) {
    console.log(colors.red, `getAllPendingQDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.getOnePendingQDetails = async function (req, res) {
  var data = {}
  try {
    let chatQData = await chatQDetails.getOnePendingQ(data)
    console.log(colors.green, `getOnePendingQDetails ${chatQData}`)
    res.status(200).json({ status: true, chatQData: chatQData })
  } catch (err) {
    console.log(colors.red, `getOnePendingQDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.updateQAcknowledgeDetails = async function (req, res) {
  var data = req.body
  data._id = data.id

  try {
    let chatQData = await chatQDetails.updateQAcknowledge(data)
    console.log(colors.green, `updateQAcknowledgeDetails: ${chatQData}`)
    res.status(200).json({ status: true, chatQData: chatQData })
  } catch (err) {
    console.log(colors.red, `updateQAcknowledgeDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.updateQDeletionDetails = async function (req, res) {
  var data = req.body
  data._id = data.id

  try {
    let chatQData = await chatQDetails.updateQDeletion(data)
    console.log(colors.green, `updateQDeletionDetails: ${chatQData}`)
    res.status(200).json({ status: true, chatQData: chatQData })
  } catch (err) {
    console.log(colors.red, `updateQDeletionDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.deleteQDetails = async function (req, res) {
  var data = { _id: req.params.id }
  try {
    let chatQData = await chatQDetails.deleteQ(data)
    console.log(colors.green, `deleteQDetails ${chatQData}`)
    res.status(200).json({ status: true, chatQData: chatQData })
  } catch (err) {
    console.log(colors.red, `deleteQDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.deleteAllQDetails = async function (req, res) {
  var data = {}
  try {
    let chatQData = await chatQDetails.deleteAllQueues(data)
    console.log(colors.green, `deleteAllQDetails ${chatQData}`)
    res.status(200).json({ status: true, chatQData: chatQData })
  } catch (err) {
    console.log(colors.red, `deleteAllQDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.deleteSelectedQDetails = async function (req, res) {
  var data = req.body
  try {
    if (Array.isArray(data.selected)) {
      let chatQData = await chatQDetails.deleteSelectedQueues(data)
      console.log(colors.green, `deleteSelectedQDetails ${chatQData}`)
      res.status(200).json({ status: true, chatQData: chatQData })
    } else {
      res.status(400).json({ status: false, error: "The property selected is not an array." })
    }
  } catch (err) {
    console.log(colors.red, `deleteSelectedQDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}
