//import mongoose models
var inboxModel = require("../models/emailInbox")

//export 4 functions i.e create,read,update,delete
module.exports = {
  createMail: createMail,
  getAllEmails: getAllEmails,
  getSingleThread: getSingleThread,
  deleteThread: deleteThread,
  updateSeen: updateSeen,
  deleteSelectedThreads: deleteSelectedThreads,
}

async function createMail(data) {
  // console.log("createUser",data)
  var details = new inboxModel()
  details.date = data.date
  details.from = data.from
  details.subject = data.subject
  details.html = data.html
  details.to = data.to
  details.attachments = data.attachments
  details.isRead = false

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

async function getAllEmails(data) {
  try {
    let result = await inboxModel.find({}).sort({ date: -1 }).select("_id date from subject isRead attachments")
    return result
  } catch (err) {
    throw err
  }
}

async function getSingleThread(data) {
  try {
    let result = await inboxModel.findOne({ _id: data._id })
    return result
  } catch (err) {
    throw err
  }
}

async function deleteThread(data) {
  console.log("deleteThread", data)
  try {
    let result = await inboxModel.deleteOne({ _id: data._id })
    return result
  } catch (err) {
    throw err
  }
}

async function updateSeen(data) {
  console.log("updateSeen", data)
  try {
    let result = await inboxModel.findOneAndUpdate({ _id: data._id }, { isRead: data.isRead })
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
