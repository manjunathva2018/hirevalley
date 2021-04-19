var roomModel = require("../models/room")
var userModel = require("../models/user")
/**
 * Make any changes you need to make to the database here
 */
async function up() {
  let adminData = {
    userName: "admin",
    email: "admin@hirevalley.com",
    password: "admin@123",
    mobileNo: "298982278",
    role: 1,
    dateOfCreation: new Date(),
    isActive: true,
    isOnline: false,
    logout: null,
    oldPassword: null,
  }

  try {
    let userData = await this("users").create(adminData)
    let room = {
      roomName: "CSA group chat",
      roomType: "GROUP_CHAT",
      namespace: "CUSTOMER-SERVICE-ASSOCIATIVE",
      issue: "CSA group chat",
      messagesCount: 0,
      users: [],
      owner: userData._id,
      createdAt: new Date(),
    }
    return await this("rooms").create(room)
  } catch (err) {
    throw err
  }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  // Write migration here
}

module.exports = { up, down }
