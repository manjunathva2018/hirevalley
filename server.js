var express = require("express")
var http = require("http")
var socketIO = require("socket.io")
var path = require("path")
var bodyParser = require("body-parser")
const helmet = require("helmet")
const cors = require("cors")
const colors = require("./constants/colors")

var mongooseconfig = require("./db-config/mongooseConfig")
var app = express()

//import routers
var user = require(path.join(__dirname, "/routes/user"))
var email = require(path.join(__dirname, "/routes/email"))
var room = require(path.join(__dirname, "/routes/room"))
var chat = require(path.join(__dirname, "/routes/chatHistory"))
var customersQ = require(path.join(__dirname, "/routes/chatQueue"))

//use middlewares
app.use(helmet()) //helmet sets headers for security

app.use(cors())
app.use(express.static(path.join(__dirname, "/front-end/dist")))

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: true }));

// parse application/json
app.use(bodyParser.json())

//use the api
app.use("/api/user", user)
app.use("/api/email", email)
app.use("/api/room", room)
app.use("/api/chatHistory", chat)
app.use("/api/customerQueue", customersQ)

var server = http.Server(app)
var io = socketIO(server)
const port = process.env.PORT || 2000

server.listen(port, function () {
  console.log(colors.yellow, `Server started at port : ${server.address().port}`)
})

process.on("unhandledRejection", (err) => {
  console.error(err.name, err.message)
  console.warn(colors.blue, "Unhandled rejection!")
  server.close(() => {
    process.exit(1)
  })
})

process.on("uncaughtException", (err) => {
  console.error(err.name, err.message)
  console.warn(colors.cyan, "Uncaught exception, catch the errors!")
  process.exit(1)
})

module.exports.io = io
