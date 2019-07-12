const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: `example@company.com`,
    subject: `Thanks for joining`,
    text: `Hello ${name}, thanks for joining our app`
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: `example@company.com`,
    subject: `sorry to see ya go`,
    text: `Goodbye ${name}, we are sorry to see you go.`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};
