const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    this.firstName = user.userName;
    this.from = `World of Gaming <${process.env.EMAIL_FROM}>`;
  }
  createNewTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: `Hello From World Of Gaming ${this.firstName}`,
    };

    // 3) Create a transport and send Email
    await this.createNewTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    console.log('hell');
    await this.send('Welcome to the World of Gaming');
  }
};
