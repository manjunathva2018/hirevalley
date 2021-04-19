const express = require("express")
var router = express.Router()
var roomDetails = require("../controllers/roomController")

router.route("/create").post(roomDetails.createRoomDetails)

router.route("/getAll").get(roomDetails.getAllRoomDetails)

router.route("/getAll/namespace/:namespace").get(roomDetails.getAllRoomByNamespaceDetails)

router.route("/id/:id").get(roomDetails.getOneRoomDetails)

router.route("/updateRoomUsers").patch(roomDetails.updateRoomUserDetails)

router.route("/delete/:id").delete(roomDetails.deleteRoomDetails)

module.exports = router
