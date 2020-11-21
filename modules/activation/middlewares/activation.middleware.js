const ActivationModel = require('../models/activation.model');
const UserModel = require('../../users/models/users.model');

const config = require('../../common/config/env.config');
exports.confirmHostOrigin = (req, res, next) => {
	if (req.headers.origin == config.webOrigin) {
		console.log('Domain is matched. Information is from Authentic email');
	} else {
		res.end('<h1>Request is from unknown source');
	}
};

exports.insertCode = (req, res, next) => {
	UserModel.findByEmail(req.params.email)
		.then((result) => {
			ActivationModel.createCode({ userId: result._id })
				.then((result) => {
					req.params.activationCode = result._id;
					next();
				})
				.catch((result) => {
					res.status(404).send({});
				});
		})
		.catch((result) => {
			res.status(404).send({});
		});
};

exports.checkById = (req, res, next) => {
	ActivationModel.findById(req.params.codeId)
		.then((result) => {
			req.params.userId = result.userId;
			req.body = { active: true };
			next();
		})
		.catch((result) => {
			console.log('Id no encontrado');
			res.status(404).send({});
		});
};

exports.removeById = (req, res, next) => {
	ActivationModel.removeById(req.params.codeId)
		.then((result) => {
			next();
		})
		.catch((result) => {
			res.status(204).send({});
		});
};
