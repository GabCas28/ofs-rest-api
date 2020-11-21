const UserModel = require('../models/users.model');
const crypto = require('crypto');

exports.continue = (req, res) => {
	res.status(204).send({});
};

exports.insert = (req, res) => {
	let salt = crypto.randomBytes(16).toString('base64');
	let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
	req.body.password = salt + '$' + hash;
	req.body.permissionLevel = 1;
	UserModel.createUser(req.body)
		.then((result) => {
			res.status(201).send({ id: result._id });
		})
		.catch((result) => {
			res.status(204).send({});
		});
};

exports.list = (req, res) => {
	let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
	let page = 0;
	if (req.query) {
		if (req.query.page) {
			req.query.page = parseInt(req.query.page);
			page = Number.isInteger(req.query.page) ? req.query.page : 0;
		}
	}
	UserModel.list(limit, page)
		.then((result) => {
			res.status(200).send(result);
		})
		.catch((result) => {
			res.status(204).send({});
		});
};

exports.checkByEmail = (req, res) => {
	UserModel.findByEmail(req.params.email)
		.then((result) => {
			result = result ? true : false;
			res.status(200).send(result);
		})
		.catch((result) => {
			res.status(204).send({});
		});
};

exports.activateByEmail = (req, res) => {
	UserModel.findByEmail(req.params.email)
		.then((result) => {
			if (Array.isArray(result) && result.length) {
				req.active = true;
				UserModel.patchUser(result[0].id, req.body)
					.then((result) => {
						res.status(200).send({});
					})
					.catch((result) => {
						res.status(404).send({});
					});
			} else res.status(404).send('false');
		})
		.catch((result) => {
			res.status(404).send({});
		});
};

exports.getByEmail = (req, res) => {
	UserModel.findByEmail(req.params.email)
		.then((result) => {
			res.status(200).send(result);
		})
		.catch((result) => {
			res.status(204).send({});
		});
};

exports.getById = (req, res) => {
	UserModel.findById(req.params.userId)
		.then((result) => {
			res.status(200).send(result);
		})
		.catch((result) => {
			res.status(204).send({});
		});
};

exports.patchById = (req, res) => {
	if (req.body.password) {
		let salt = crypto.randomBytes(16).toString('base64');
		let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
		req.body.password = salt + '$' + hash;
	}

	UserModel.patchUser(req.params.userId, req.body)
		.then((result) => {
			res.status(204).send({});
		})
		.catch((result) => {
			res.status(204).send({});
		});
};

exports.removeById = (req, res) => {
	UserModel.removeById(req.params.userId)
		.then((result) => {
			res.status(204).send({});
		})
		.catch((result) => {
			res.status(204).send({});
		});
};
