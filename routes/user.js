const express = require("express")
var router = express.Router()
var userDetails = require("../controllers/userController")

router.route("/create").post(userDetails.createUserDetails)

router.route("/email/:email/password/:password").get(userDetails.getUserAuth)

router.route("/id/:id").get(userDetails.getUserDetails)

router.route("/getAll").get(userDetails.getAllUserTypeDetails)

router.route("/role/:role").get(userDetails.getUserTypeDetails)

router.route("/update").put(userDetails.updateUserDetails)

router.route("/delete/:id").delete(userDetails.deleteUserDetails)

router.route("/updateLogout").put(userDetails.updateLogoutDetails)

module.exports = router
