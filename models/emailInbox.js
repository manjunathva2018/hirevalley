var mongoose = require("mongoose")
const Schema = mongoose.Schema
//schema
var emailInboxSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  from: {
    type: String,
    required: true,
  },
  html: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: false,
  },
  to: {
    type: String,
    required: true,
  },
  attachments: {
    type: [Schema.Types.Mixed],
    required: false,
  },
  isRead: {
    type: Boolean,
    required: false,
  },
})
// compile schema to model
module.exports = mongoose.model("inboxEmails", emailInboxSchema, "inboxEmails")
