const express = require("express")
var router = express.Router()
var emailDetails = require("../controllers/mailController")

router.route("/sync").get(emailDetails.syncEmails)

router.route("/inbox").get(emailDetails.getAllInbox)

router.route("/inbox/filename/:fileName").get(emailDetails.fetchInboxAttachments)

router.route("/inbox/:id").delete(emailDetails.deleteInboxThread)

router.route("/inbox/deleteSelected").patch(emailDetails.deleteInboxSelectedThreads)

router.route("/inbox/seen/:id").get(emailDetails.updateReadThread)

router.route("/inbox/:id").get(emailDetails.getThread)

router.route("/send").post(emailDetails.uploadSentAttachments)

router.route("/sent").get(emailDetails.getAllSent)

router.route("/sent/:id").get(emailDetails.getSentThread)

router.route("/sent/filename/:fileName").get(emailDetails.fetchSentAttachments)

router.route("/sent/:id").delete(emailDetails.deleteSentThread)

router.route("/sent/deleteSelected").patch(emailDetails.deleteSentSelectedThreads)

module.exports = router
