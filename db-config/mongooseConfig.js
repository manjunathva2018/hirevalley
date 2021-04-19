//import mongoose module
var mongoose = require("mongoose")
const colors = require("./../constants/colors")

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/hirevalley", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

//mongoose connection
var db = mongoose.connection
db.on("error", console.error.bind(console, colors.red, "connection error:"))
db.once("open", function () {
  console.log(colors.cyan, "Database Connected!")
})
