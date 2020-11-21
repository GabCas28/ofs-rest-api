const RecoveryModel = require('../models/recovery.model');
const UserModel = require('../../users/models/users.model');
const config = require('../../common/config/env.config');
exports.confirmHostOrigin = (req, res, next) => {
	if (req.headers.origin == config.webOrigin) {
		console.log('Domain is matched. Information is from Authentic email');
	} else {
		res.end('<h1>Request is from unknown source');
	}
};

exports.addCode = (req, res, next) => {
	UserModel.findByEmail(req.params.email)
		.then((result) => {
			RecoveryModel.createCode({ userId: result._id })
				.then((result) => {
					console.log('Recovery code', result);
					req.params.recoveryCode = result._id;
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
	RecoveryModel.findById(req.params.recoveryCode)
		.then((result) => {
			req.params.userId = result.userId;
			next();
		})
		.catch((result) => {
			console.log('Id no encontrado');
			res.status(404).send({});
		});
};

exports.removeById = (req, res, next) => {
	RecoveryModel.removeById(req.params.recoveryCode)
		.then(() => {
			next();
		})
		.catch((result) => {
			console.log(result);
			res.status(204).send({});
		});
};
