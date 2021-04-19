var nodemailer = require("nodemailer")
var appConfig = require("../appConfig")
var { MailListener } = require("mail-listener5")
const colors = require("./../constants/colors")
var path = require("path")
var inboxEmails = require("../crud/inboxCrud")

module.exports = {
  sendMail: sendMail,
  receiveMail: receiveMail,
}

function sendMail(recipients, subject, body, attachments, cc, callback) {
  // credentials
  var username = appConfig.email.smtp.username
  var password = appConfig.email.smtp.password

  // create reusable transporter object using the default SMTP transport
  // var transporter = nodemailer.createTransport('smtps://' + username + ':' + password + '@smtp.gmail.com');

  let transporter = nodemailer.createTransport({
    host: appConfig.email.smtp.host,
    port: appConfig.email.smtp.port,
    secure: appConfig.email.smtp.secure, // true for 465, false for other ports
    auth: {
      user: username, // generated ethereal user
      pass: password, // generated ethereal password
    },
  })

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: appConfig.email.smtp.from, // sender address
    to: recipients, // list of receivers
    subject: subject, // Subject line
    html: body,
  }

  if (cc) {
    mailOptions.cc = cc
  }

  if (attachments) {
    mailOptions.attachments = attachments
    // [{
    //     filename: attachments.filename,
    //     path: attachments.filepath
    // }]
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (err, info) {
    callback(err, info)
  })
}

async function receiveMail() {
  return new Promise((resolve, reject) => {
    var mailListener = new MailListener({
      username: appConfig.email.imap.username,
      password: appConfig.email.imap.password,
      host: appConfig.email.imap.host,
      port: appConfig.email.imap.port,
      tls: appConfig.email.imap.tls,
      connTimeout: 10000, // Default by node-imap
      authTimeout: 5000, // Default by node-imap,
      debug: console.log, // Or your custom function with only one incoming argument. Default: null
      tlsOptions: { rejectUnauthorized: false },
      mailbox: "INBOX", // mailbox to monitor
      searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
      markSeen: true, // all fetched email willbe marked as seen and not fetched next time
      fetchUnreadOnStart: false, // use it only if you want to get all unread email on lib start. Default is `false`,
      attachments: true, // download attachments as they are encountered to the project directory
      attachmentOptions: { directory: path.join(__dirname, "./../email-attachments/inbox/") }, // specify a download directory for attachments
    })

    mailListener.start() // start listening

    // stop listening
    //mailListener.stop();

    mailListener.on("server:connected", function () {
      console.log(colors.yellow, "imapConnected")
      resolve(true)
    })

    mailListener.on("mailbox", function (mailbox) {
      console.log("Total number of mails: ", mailbox.messages.total) // this field in mailbox gives the total number of emails
    })

    mailListener.on("server:disconnected", function () {
      console.log(colors.cyan, "imapDisconnected")
      reject(false)
    })

    mailListener.on("error", function (err) {
      console.log(colors.red, err)
      reject(err)
    })

    //   mailListener.on("headers", function(headers, seqno){

    //   });

    //   mailListener.on("body", function(body, seqno){

    //   })

    //   mailListener.on("attachment", function(attachment, path, seqno){

    //   });

    mailListener.on("mail", async function (mail, seqno) {
      try {
        let data = {
          date: mail.date,
          from: mail.from.text,
          html: mail.html,
          subject: mail.subject,
          to: mail.to.text,
          attachments: mail.attachments.map(function (item) {
            return { contentType: item.contentType, filename: item.filename }
          }),
        }
        let emailData = await inboxEmails.createMail(data)
        console.log(colors.green, emailData)
      } catch (err) {
        console.log(colors.red, `mail save err ${err}`)
      }
    })
  })
}
