var mongoose = require("mongoose")
const Schema = mongoose.Schema
//schema
var emailSentSchema = new mongoose.Schema({
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
})
// compile schema to model
module.exports = mongoose.model("sentEmails", emailSentSchema, "sentEmails")
