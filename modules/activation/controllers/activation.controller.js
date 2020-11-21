const ActivationModel = require('../models/activation.model'),
	nodemailer = require('nodemailer'),
	config = require('../../common/config/env.config');

let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, // true for 465, false for other ports
	auth: {
		user: 'observatorio.f.s.no.reply@gmail.com', // generated ethereal user
		pass: 'Observatori0' // generated ethereal password
	}
});

exports.sendActivationEmail = (req, res, next) => {
	link = config.webEndpoint + '/activar/' + req.params.activationCode;
	transporter
		.sendMail({
			from: '"Observatorio Francisco Sánchez⭐" <observatorio.f.s.no.reply@gmail.com>',
			to: req.params.email,
			subject: 'Activación Registro ✔',
			text: 'Pulse el siguiente enlace para activar su cuenta: ' + link,
			html:
				'<b>Pulse el siguiente enlace para competar activar su cuenta: </b> <br/><a href="' +
				link +
				'">' +
				link +
				'</a>'
		})
		.then((info) => {
			console.log('Message sent: %s', info.messageId);
			return res.status(201).send({ message: info });
		})
		.catch((error) => {
			console.log(error);
			return res.status(400).send({ error: error });
		});
};

exports.confirmUserActivation = (req, res, next) => {
	console.log(req.protocol + ':/' + req.get('Host'));
	if (req.query.id == Rand) {
		console.log('email is verified');
		res.end('<h1>Email ' + mailOptions.to + ' is been Successfully verified');
	} else {
		console.log('email is not verified');
		res.end('<h1>Bad Request</h1>');
	}
};
