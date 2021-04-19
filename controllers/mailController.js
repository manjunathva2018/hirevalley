var path = require("path")
var mime = require("mime")
var fs = require("fs")
const colors = require("./../constants/colors")
const email = require("./../middlewares/email")
const inboxEmails = require("./../crud/inboxCrud")
const sentEmails = require("./../crud/sentCrud")
var multer = require("multer")
var appConfig = require("../appConfig")

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../email-attachments/sent/"))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

var upload = multer({
  storage: storage,
  limits: {
    fileSize: appConfig.maxFileSize * 1024 * 1024,
  },
}).array("attachments", 5)

//Inbox APIs

module.exports.syncEmails = async function (req, res) {
  // var data = { _id: req.params.id };
  let p = email.receiveMail()
  p.then(
    function (succ) {
      if (succ) {
        res.status(200).json({ status: true, message: "sync in progress" })
      }
    },
    function (err) {
      console.log(colors.red, `syncEmails err ${err}`)
      res.status(400).json({ status: false, error: err })
    }
  )
}

module.exports.getAllInbox = async function (req, res) {
  var data = {}
  try {
    let inboxData = await inboxEmails.getAllEmails(data)
    console.log(colors.green, `getAllInbox ${inboxData}`)
    res.status(200).json({ status: true, inboxData: inboxData })
  } catch (err) {
    console.log(colors.red, `getAllInbox err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.getThread = async function (req, res) {
  var data = { _id: req.params.id }
  try {
    let inboxData = await inboxEmails.getSingleThread(data)
    console.log(colors.green, `getThread`, inboxData)
    res.status(200).json({ status: true, inboxData: inboxData })
  } catch (err) {
    console.log(colors.red, `getThread err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.updateReadThread = async function (req, res) {
  var data = { _id: req.params.id, isRead: true }
  try {
    let inboxData = await inboxEmails.updateSeen(data)
    console.log(colors.green, `updateReadThread`, inboxData)
    res.status(200).json({ status: true, inboxData: inboxData })
  } catch (err) {
    console.log(colors.red, `updateReadThread err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.deleteInboxThread = async function (req, res) {
  var data = { _id: req.params.id }
  try {
    let inboxData = await inboxEmails.deleteThread(data)
    console.log(colors.green, `deleteInboxThread ${inboxData}`)
    res.status(200).json({ status: true, inboxData: inboxData })
  } catch (err) {
    console.log(colors.red, `deleteInboxThread err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.deleteInboxSelectedThreads = async function (req, res) {
  var data = req.body
  try {
    if (Array.isArray(data.selected)) {
      let sentData = await inboxEmails.deleteSelectedThreads(data)
      console.log(colors.green, `deleteInboxSelectedThreads ${sentData}`)
      res.status(200).json({ status: true, sentData: sentData })
    } else {
      res.status(400).json({ status: false, error: "The property selected is not an array" })
    }
  } catch (err) {
    console.log(colors.red, `deleteInboxSelectedThreads err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.fetchInboxAttachments = async function (req, res) {
  var fileReq = req.params.fileName
  var file = path.join(__dirname, "../email-attachments/inbox/" + fileReq)
  var filename = path.basename(file)
  var mimetype = mime.lookup(file)
  // res.download(file); // Set disposition and send it.

  fs.exists(file, function (exists) {
    if (exists) {
      res.writeHead(200, {
        "Content-Type": mimetype,
        "Content-Disposition": "attachment; filename=" + filename,
      })
      fs.createReadStream(file).pipe(res)
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" })
      res.end("ERROR File does NOT Exists")
    }
  })
}

module.exports.uploadSentAttachments = function (req, res) {
  upload(req, res, function (err) {
    var data = req.body
    var attachments = []

    if (req.files != undefined) {
      req.files.forEach((ele) => {
        attachments.push({
          filename: ele.filename,
          path: ele.path,
        })
      })
    }

    if (err instanceof multer.MulterError) {
      res.status(400).json({ status: false, message: "Some error occurred while uploading the file :" + err.message })
      // A Multer error occurred when uploading.
    } else if (err) {
      res.status(400).json({ status: false, message: "Some error occurred while uploading" + err.message })
      // An unknown error occurred when uploading.
    } else {
      email.sendMail(data.recipients, data.subject, data.body, attachments, data.cc, function (err, info) {
        if (err) {
          res.status(400).json({ status: false, message: err })
        }
        if (info.messageId) {
          try {
            let saveData = {
              date: new Date(),
              from: appConfig.email.smtp.from,
              subject: data.subject,
              html: data.body,
              to: data.recipients,
              attachments: attachments,
            }
            let sent = sentEmails.createSentMail(saveData)
            res.status(200).json({ status: true, message: "Email sent successfully" })
          } catch (err) {
            console.log(colors.red, err)
          }
        }
      })
    }

    // Everything went fine.
  })
}

//sent

module.exports.getAllSent = async function (req, res) {
  var data = {}
  try {
    let sentData = await sentEmails.getAllSentMails(data)
    console.log(colors.green, `getAllSent ${sentData}`)
    res.status(200).json({ status: true, sentData: sentData })
  } catch (err) {
    console.log(colors.red, `getAllSent err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.getSentThread = async function (req, res) {
  var data = { _id: req.params.id }
  try {
    let sentData = await sentEmails.getBySingleDoc(data)
    console.log(colors.green, `getSentThread`, sentData)
    res.status(200).json({ status: true, sentData: sentData })
  } catch (err) {
    console.log(colors.red, `getSentThread err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.deleteSentThread = async function (req, res) {
  var data = { _id: req.params.id }
  try {
    let sentData = await sentEmails.deleteSingleDoc(data)
    console.log(colors.green, `deleteSentThread ${sentData}`)
    res.status(200).json({ status: true, sentData: sentData })
  } catch (err) {
    console.log(colors.red, `deleteSentThread err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.deleteSentSelectedThreads = async function (req, res) {
  var data = req.body
  try {
    if (Array.isArray(data.selected)) {
      let sentData = await sentEmails.deleteSingleDoc(data)
      console.log(colors.green, `deleteSentSelectedThreads ${sentData}`)
      res.status(200).json({ status: true, sentData: sentData })
    } else {
      res.status(400).json({ status: true, error: "The property selected is not an array." })
    }
  } catch (err) {
    console.log(colors.red, `deleteSentSelectedThreads err ${err}`)
    res.status(400).json({ status: false, error: err })
  }
}

module.exports.fetchSentAttachments = async function (req, res) {
  var fileReq = req.params.fileName
  var file = path.join(__dirname, "../email-attachments/sent/" + fileReq)
  var filename = path.basename(file)
  var mimetype = mime.lookup(file)
  // res.download(file); // Set disposition and send it.

  fs.exists(file, function (exists) {
    if (exists) {
      res.writeHead(200, {
        "Content-Type": mimetype,
        "Content-Disposition": "attachment; filename=" + filename,
      })
      fs.createReadStream(file).pipe(res)
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" })
      res.end("ERROR File does NOT Exists")
    }
  })
}
