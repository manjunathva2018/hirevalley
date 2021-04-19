//import mongoose models
var sentModel = require("../models/emailSent")

//export 4 functions i.e create,read,update,delete
module.exports = {
  createSentMail: createSentMail,
  getAllSentMails: getAllSentMails,
  getBySingleDoc: getBySingleDoc,
  deleteSingleDoc: deleteSingleDoc,
  deleteSelectedThreads: deleteSelectedThreads,
}

async function createSentMail(data) {
  // console.log("createUser",data)
  var details = new sentModel()
  details.date = data.date
  details.from = data.from
  details.subject = data.subject
  details.html = data.html
  details.to = data.to
  details.attachments = data.attachments

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

async function getAllSentMails(data) {
  try {
    let result = await sentModel.find({}).sort({ date: -1 }).select("_id date to subject attachments")
    return result
  } catch (err) {
    throw err
  }
}

async function getBySingleDoc(data) {
  try {
    let result = await sentModel.findOne({ _id: data._id })
    return result
  } catch (err) {
    throw err
  }
}

async function deleteSingleDoc(data) {
  console.log("deleteSingleDoc", data)
  try {
    let result = await sentModel.deleteOne({ _id: data._id })
    return result
  } catch (err) {
    throw err
  }
}

async function deleteSelectedThreads(data) {
  console.log("deleteSelectedThreads", data)
  try {
    let result = await chatQModel.deleteMany({
      _id: {
        $in: data.selected,
      },
    })
    return result
  } catch (err) {
    throw err
  }
}
