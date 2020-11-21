const BookingsModel = require('../models/bookings.model');
const moment = require('moment');

exports.continue = (req, res) => {
	res.status(204).send({});
};

exports.insert = (req, res) => {
	BookingsModel.createBooking(req.body)
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
	BookingsModel.list(limit, page)
		.then((result) => {
			res.status(200).send(result);
		})
		.catch((result) => {
			res.status(204).send({});
		});
};

exports.getCurrent = (req, res) => {
	BookingsModel.findCurrent()
		.then((result) => {
			res.status(200).send(result);
		})
		.catch((result) => {
			res.status(204).send({});
		});
};

exports.getById = (req, res) => {
	BookingsModel.findById(req.params.bookingId)
		.then((result) => {
			res.status(200).send(result);
		})
		.catch((result) => {
			res.status(204).send({});
		});
};

exports.patchById = (req, res) => {
	BookingsModel.patchBooking(req.params.bookingId, req.body)
		.then((result) => {
			res.status(204).send({});
		})
		.catch((result) => {
			res.status(204).send({});
		});
};

exports.removeById = (req, res) => {
	BookingsModel.removeById(req.params.bookingId)
		.then((result) => {
			res.status(204).send({});
		})
		.catch((result) => {
			res.status(204).send({});
		});
};
