//import mongoose models
var userModel = require("../models/user")

//export 4 functions i.e create,read,update,delete
module.exports = {
  createUser: createUser,
  authUser: authUser,
  getAllUsers: getAllUsers,
  getByUserRole: getByUserRole,
  getSingleUser: getSingleUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  updateLogout: updateLogout,
}

async function createUser(data) {
  // console.log("createUser",data)
  var details = new userModel()
  details.userName = data.userName
  details.email = data.email
  details.password = data.password
  details.mobileNo = data.mobileNo
  details.oldPassword = null
  details.dateOfCreation = new Date()
  details.role = data.role
  details.login = null
  details.isOnline = false
  details.logout = null
  details.isActive = true
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

async function getAllUsers(data) {
  try {
    let result = await userModel.find({})
    return result
  } catch (err) {
    throw err
  }
}

async function getByUserRole(data) {
  try {
    let result = await userModel.find({ role: data.role }).select("userName email mobileNo role isActive")
    return result
  } catch (err) {
    throw err
  }
}

async function authUser(data) {
  try {
    let result = await userModel.findOne({ email: data.email })
    return result
  } catch (err) {
    throw err
  }
}

async function getSingleUser(data) {
  try {
    let result = await userModel.findById({ _id: data._id })
    return result
  } catch (err) {
    throw err
  }
}

async function updateUser(data) {
  console.log("updateUser", data)
  try {
    let result = await userModel.findOneAndUpdate(
      { _id: data._id },
      { email: data.email, password: data.password, role: data.role },
      { upsert: true, new: true }
    )
    return result
  } catch (err) {
    throw err
  }
}

async function deleteUser(data) {
  console.log("deleteUser", data)
  try {
    let result = await userModel.deleteOne({ _id: data._id })
    return result
  } catch (err) {
    throw err
  }
}

async function updateLogout(data) {
  console.log("updateLogout", data)
  try {
    let result = await userModel.findOneAndUpdate({ _id: data._id }, { logout: data.logout })
    return result
  } catch (err) {
    throw err
  }
}
