//import mongoose models
var chatQModel = require("../models/chatQueue")
var userModel = require("../models/user")

//export 4 functions i.e create,read,update,delete
module.exports = {
  createQ: createQ,
  getAllQueues: getAllQueues,
  getAllPendingQ: getAllPendingQ,
  getAllPendingQCount: getAllPendingQCount,
  getOnePendingQ: getOnePendingQ,
  updateQAcknowledge: updateQAcknowledge,
  updateQDeletion: updateQDeletion,
  deleteQ: deleteQ,
  deleteAllQueues: deleteAllQueues,
  deleteSelectedQueues: deleteSelectedQueues,
}

async function createQ(data) {
  // console.log("createUser",data)
  var details = new chatQModel()
  details.payload = data.payload
  details.ack = null
  details.deleted = null
  details.createdAt = new Date()

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

async function getAllQueues(data) {
  try {
    let result = await chatQModel
      .find({})
      .populate({ model: userModel, path: "ack", select: "userName" })
      .sort({ createdAt: 1 })
    return result
  } catch (err) {
    throw err
  }
}

async function getAllPendingQCount() {
  try {
    let result = await chatQModel.aggregate([
      {
        $match: {
          deleted: null,
          ack: null,
          createdAt: { $lte: new Date() },
        },
      },
      {
        $group: { _id: "$ack", count: { $sum: 1 } },
      },
      {
        $sort: { createdAt: 1 },
      },
    ])
    return result
  } catch (err) {
    throw err
  }
}

async function getAllPendingQ(data) {
  try {
    let result = await chatQModel
      .find({
        deleted: null,
        ack: null,
        createdAt: {
          $lte: new Date(),
        },
      })
      .sort({ createdAt: 1 })
    return result
  } catch (err) {
    throw err
  }
}

async function getOnePendingQ(data) {
  try {
    let result = await chatQModel
      .findOne({
        deleted: null,
        ack: null,
        createdAt: {
          $lte: new Date(),
        },
      })
      .sort({ createdAt: 1 })
    return result
  } catch (err) {
    throw err
  }
}

async function updateQAcknowledge(data) {
  console.log("updateQAcknowledge", data)
  try {
    let result = await chatQModel.findOneAndUpdate({ _id: data._id, ack: { $eq: null } }, { ack: data.userId })
    return result
  } catch (err) {
    throw err
  }
}

async function updateQDeletion(data) {
  console.log("updateQDeletion", data)
  try {
    let result = await chatQModel.findOneAndUpdate({ _id: data._id, ack: { $ne: null } }, { deleted: new Date() })
    return result
  } catch (err) {
    throw err
  }
}

async function deleteQ(data) {
  console.log("deleteQ", data)
  try {
    let result = await chatQModel.deleteOne({
      _id: data._id,
      deleted: { $ne: null },
    })
    return result
  } catch (err) {
    throw err
  }
}

async function deleteAllQueues(data) {
  console.log("deleteAllQueues", data)
  try {
    let result = await chatQModel.deleteMany({
      deleted: { $ne: null },
    })
    return result
  } catch (err) {
    throw err
  }
}

async function deleteSelectedQueues(data) {
  console.log("deleteSelectedQueues", data)
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
