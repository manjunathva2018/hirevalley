const express = require("express")
var router = express.Router()
var chatDetails = require("../controllers/chatController")

router.route("/create").post(chatDetails.createChatDetails)

router.route("/getAll").get(chatDetails.getAllChatDetails)

router.route("/roomId/:roomId").get(chatDetails.getAllChatsByRoomDetails)

router.route("/delete/:id").delete(chatDetails.deleteChatDetails)

module.exports = router
