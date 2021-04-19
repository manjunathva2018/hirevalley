const io = require("../server").io
const chatCrud = require("../crud/chatCrud")
const roomCrud = require("../crud/roomCrud")
const queueCrud = require("../crud/chatQueueCrud")

var onlineAgents = []

io.on("connection", function (socket) {
  const socketQuery = socket.handshake.query
  let userData = JSON.parse(socketQuery.userData)
  userData.socketId = socket.id
  userData.isBusy = false
  console.log("user connected", userData)

  if (userData.roleName == "Customer Service Associative") {
    //should replace with findIndex method
    let filter = onlineAgents.filter((elem) => {
      return elem.id == userData.id
    })
    if (filter.length == 0) {
      onlineAgents.push(userData)
      io.emit("send-online-agents", onlineAgents)
    }
  }

  let timerId = setInterval(function () {
    io.emit("send-online-agents", onlineAgents)
  }, 2000)

  //create room for job-seeker/employer with CSA
  socket.on("create-room", async (room) => {
    let roomObj = room
    try {
      //save the room for storing chats
      let savedRoom = await roomCrud.createRoom(roomObj)
      savedPayload = await queueCrud.createQ({ payload: savedRoom })
      let queue = await queueCrud.getAllPendingQCount()
      io.to(savedRoom.roomName).emit("recieve-notification", queue[0].count)
      io.emit("recieve-queue-update", room)
      io.to(savedRoom.roomName).emit("update-room", savedRoom)
    } catch (err) {
      console.log(err)
    }
  })

  //update busy flag
  socket.on("update-busy", (user) => {
    onlineAgents.some((ele) => {
      if (ele.id == user.id) {
        ele.isBusy = user.isBusy
        return true
      }
      return false
    })
  })

  //save the room inside the DB and join the room for job-seeker/employer with CSA
  socket.on("join-new-room", async (room) => {
    try {
      await roomCrud.updateRoomUsers(room)
      io.emit("recieve-queue-update", room)
    } catch (err) {
      console.log(err)
    }

    socket.join(room.roomName, () => {
      room.notify = true
      socket.to(room.roomName).emit("update-room", room)
    })
  })

  //create room for CSA 1 to 1 chat
  socket.on("create-csa-room", (room) => {
    onlineAgents.forEach((ele) => {
      if (ele.userName == room.roomName) {
        io.to(ele.socketId).emit("new-csa-room", room)
      }
    })
  })

  //save room for CSA 1 to 1 chat
  socket.on("save-csa-new-room", async (room) => {
    let savedRoom = room
    try {
      savedRoom = await roomCrud.createRoom(room)
      socket.join(room.roomName, () => {
        socket.emit("new-csa-room", room)
        room.notify = `${room.owner.userName} accepted your invite, please enter 'Hi' into the chat box.`
        room._id = savedRoom._id
        socket.to(room.roomName).emit("new-chat", room)
      })
    } catch (err) {
      console.log(err)
    }
  })

  socket.on("new-message", (chat) => {
    console.log(chat)
    socket.to(chat.room).emit("message", chat)
    try {
      chatCrud.createChat(chat)
    } catch (err) {
      console.log(err)
    }
  })

  socket.on("join-room", (room) => {
    socket.join(room.roomName, () => {
      socket.emit("user-online", room)
    })
  })

  socket.on("leave-room", (room) => {
    socket.leave(room, () => {
      socket.to(room.roomName).emit("user-left", room)
    })
  })

  socket.on("send-typing", (typeObj) => {
    socket.to(typeObj.roomName).emit("typing", typeObj)
  })

  socket.on("send-notification", (room) => {
    socket.to(room).emit("recieve-notification", room)
  })

  socket.on("disconnect", () => {
    console.log("user disconnected")
    onlineAgents.forEach((ele, index) => {
      if (socket.id == ele.socketId) {
        onlineAgents.splice(index, 1)
      }
    })
    io.emit("send-online-agents", onlineAgents)
    clearInterval(timerId)
  })
})

module.exports = io
