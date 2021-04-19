const jwt = require("jsonwebtoken")
const config = require("../appConfig")
var colors = require("./../constants/colors")

module.exports.validateWebToken = function (req, res, next) {
  console.log(colors.cyan, "Token header from request :", req.header("x_auth_token"))
  const token = req.header("x_auth_token")
  if (!token) return res.status(401).json({ status: false, error: "Access Denied! No token provided" })
  try {
    const decoded = jwt.verify(token, config.jwtPrivateKey)
    req.decoded = decoded
    next()
  } catch (ex) {
    res.status(400).json({ status: false, error: "Invalid Token" })
  }
}

module.exports.generateWebToken = function (id) {
  const token = jwt.sign({ _id: id }, config.jwtPrivateKey)
  return token
}
