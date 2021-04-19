var mongoose = require("mongoose")
//schema
var userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: false,
  },
  oldPassword: {
    type: String,
    required: false,
  },
  dateOfCreation: {
    type: Date,
    required: true,
  },
  role: {
    type: Number,
    required: true,
  },
  login: {
    type: Date,
    required: false,
  },
  logout: {
    type: Date,
    required: false,
  },
  isOnline: {
    type: Boolean,
    required: false,
  },
  isActive: {
    type: Boolean,
    required: false,
  },
})
// compile schema to model
module.exports = mongoose.model("users", userSchema, "users")
