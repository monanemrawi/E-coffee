const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'monanemrawi@gmail.com',
        subject: 'Thanks for joining Mona\'s E-Coffee Shop!',
        text: `Welcome to the shop, ${name}. Let me know how you get along, and if you find what you need.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'monanemrawi@gmail.com',
        subject: 'Sorry to see you go.',
        text: `Goodbye, ${name}. I hope to see you sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}