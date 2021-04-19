var config = {
  jwtPrivateKey: "loginToken",
  email: {
    smtp: {
      host: "smtp.gmail.com",
      username: "hirevalley9@gmail.com",
      password: "0921*EXclusive",
      from: "manjunathtestproject@gmail.com",
      port: 587,
      secure: false,
    },
    imap: {
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      username: "hirevalley9@gmail.com",
      password: "0921*EXclusive",
    },
  },
  maxFileSize: 25,
}

module.exports = config
