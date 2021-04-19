//import the crud operation functions
var userDetails = require("../crud/userCrud")
var bcrypt = require("bcrypt")
const auth = require("../middlewares/auth")
const saltRounds = 10
const colors = require("./../constants/colors")

module.exports.createUserDetails = async function (req, res) {
  var data = req.body

  try {
    //password encryption
    var hash = bcrypt.hashSync(data.password, saltRounds)
    data.password = hash

    try {
      let userData = await userDetails.createUser(data)
      // console.log(colors.green, `createUserDetails:${userData}`)
      //send status code 200 i.e ok  with json object
      res.status(200).json({ status: true, userData: userData })
    } catch (err) {
      console.log(colors.red, `createUserDetails err ${err}`)
      //send status code 400 i.e error with json object
      res.status(400).json({ status: false, error: err })
    }
  } catch (err) {
    console.log(colors.red, `bcrypt err:${err}`)
  }
}

module.exports.getUserDetails = async function (req, res) {
  var data = { _id: req.params.id }
  try {
    let userData = await userDetails.getSingleUser(data)
    // console.log(colors.green, `getUserDetails ${userData}`)
    res.status(200).json({ status: true, userData: userData })
  } catch (err) {
    console.log(colors.red, `getUserDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.getAllUserTypeDetails = async function (req, res) {
  var data = {}
  try {
    let userData = await userDetails.getAllUsers(data)
    // console.log(colors.green, `getAllUserTypeDetails ${userData}`)
    res.status(200).json({ status: true, userData: userData })
  } catch (err) {
    console.log(colors.red, `getAllUserTypeDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.getUserTypeDetails = async function (req, res) {
  var data = { role: req.params.role }
  try {
    let userData = await userDetails.getByUserRole(data)
    // console.log(colors.green, `getUserTypeDetails ${userData}`)
    res.status(200).json({ status: true, userData: userData })
  } catch (err) {
    console.log(colors.red, `getUserTypeDetails err ${err}`)
    res.status(400).json({ status: false, message: err })
  }
}

module.exports.getUserAuth = async function (req, res) {
  var data = { email: req.params.email, password: req.params.password }

  try {
    let userData = await userDetails.authUser(data)

    if (userData != null) {
      try {
        const match = await bcrypt.compare(data.password, userData.password)
        console.log(colors.green, `password validation ${match}`)
        if (match) {
          let obj = {}
          obj.userName = userData.userName
          obj.id = userData._id
          obj.role = userData.role
          obj.logout = userData.logout
          const token = await auth.generateWebToken(userData._id)
          res.header("x_auth_token", token).status(200).json({ status: true, userData: obj })
        } else {
          res.status(400).json({ status: false, error: "password is incorrect !" })
        }
      } catch (err) {
        console.log(colors.red, `bcrypt compare err ${err}`)
        res.status(400).json({ status: false, error: err })
      }
    } else {
      res.status(400).json({ status: false, error: "The user does not exists !" })
    }
  } catch (err) {
    console.log(colors.red, `getUserAuth err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.updateUserDetails = async function (req, res) {
  var data = req.body
  data._id = data.id

  try {
    //password encryption
    var hash = bcrypt.hashSync(data.password, saltRounds)
    data.password = hash

    try {
      let userData = await userDetails.updateUser(data)
      // console.log(colors.green, `updateUserDetails: ${userData}`)
      res.status(200).json({ status: true, userData: userData })
    } catch (err) {
      console.log(colors.red, `updateUserDetails err ${err}`)
      res.status(400).json({ status: false, error: err })
    }
  } catch (err) {
    console.log(colors.red, `bcrypt err:${err}`)
  }
}

module.exports.deleteUserDetails = async function (req, res) {
  var data = { _id: req.params.id }
  try {
    let userData = await userDetails.deleteUser(data)
    // console.log(colors.green, `deleteUserDetails ${userData}`)
    res.status(200).json({ status: true, userData: userData })
  } catch (err) {
    console.log(colors.red, `deleteUserDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.updateLogoutDetails = async function (req, res) {
  var data = req.body
  data._id = data.id
  try {
    let userData = await userDetails.updateLogout(data)
    // console.log("\x1b[32m%s\x1b[0m", `updateLogoutDetails`, userData)
    let obj = {}
    obj.userName = userData.userName
    obj._id = userData._id
    obj.userType = userData.userType
    obj.logout = userData.logout
    res.status(200).json({ status: true, userData: obj })
  } catch (err) {
    console.log(colors.red, `updateLogoutDetails err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}
