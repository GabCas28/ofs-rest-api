const ActivationModel = require('../models/recovery.model'),
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

exports.sendRecoveryEmail = (req, res, next) => {
	console.log(req.headers.origin);
	link = config.webEndpoint + '/recuperar/' + req.params.recoveryCode;
	transporter
		.sendMail({
			from: '"Observatorio Francisco Sánchez ⭐" <observatorio.f.s.no.reply@gmail.com>',
			to: req.params.email,
			subject: 'Recuperación de contraseña ✔',
			text: 'Pulse el siguiente enlace para crear una nueva contraseña: ' + link,
			html:
				'<b>Pulse el siguiente enlace para crear una nueva contraseña: </b> <br/><a href="' +
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
exports.end = (req, res, next) => {
	return res.status(202).send({});
};
