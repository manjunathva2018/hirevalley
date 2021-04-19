const express = require("express")
var router = express.Router()
var chatQDetails = require("../controllers/chatQueueController")

router.route("/create").post(chatQDetails.createQDetails)

router.route("/getAll").get(chatQDetails.getAllQDetails)

router.route("/getAll/pending").get(chatQDetails.getAllPendingQDetails)

router.route("/pending").get(chatQDetails.getOnePendingQDetails)

router.route("/acknowledge").put(chatQDetails.updateQAcknowledgeDetails)

router.route("/markDeleted").patch(chatQDetails.updateQDeletionDetails)

router.route("/delete/:id").delete(chatQDetails.deleteQDetails)

router.route("/deleteAll").delete(chatQDetails.deleteAllQDetails)

router.route("/deleteSelected").patch(chatQDetails.deleteSelectedQDetails)

module.exports = router
