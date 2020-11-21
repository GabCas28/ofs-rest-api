const jwtSecret = require('../../common/config/env.config.js').jwt_secret,
	jwt = require('jsonwebtoken'),
	crypto = require('crypto');

exports.login = (req, res) => {
	try {
		let refreshId = req.body.userId + jwtSecret,
			salt = crypto.randomBytes(16).toString('base64'),
			hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64');
		req.body.refreshKey = salt;
		let token = jwt.sign(req.body, jwtSecret),
			b = Buffer.from(hash),
			refresh_token = b.toString('base64');
		res.status(201).send({ accessToken: token, refreshToken: refresh_token });
	} catch (err) {
		res.status(500).send({ errors: err });
	}
};

exports.refresh_token = (req, res) => {
	try {
		req.body = req.jwt;
		let token = jwt.sign(req.body, jwtSecret);
		res.status(201).send({ id: token });
	} catch (err) {
		res.status(500).send({ errors: err });
	}
};
