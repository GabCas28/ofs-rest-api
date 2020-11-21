const moment = require('moment');
const ADMIN_PERMISSION = require('../../common/config/env.config')['permissionLevels']['ADMIN'];
const BookingsModel = require('../models/bookings.model');
const config = require('config');

exports.onlySameUserOrAdminCanDoThisAction = async (req, res, next) => {
	let user_permission_level = parseInt(req.jwt.permissionLevel);
	let userId = req.jwt.userId;
	if (req.params && req.params.bookingId) {
		booking = await BookingsModel.findById(req.params.bookingId).catch((error) =>
			console.error('Error:  Booking not found')
		);
	} else {
		booking = req.body;
	}
	if (booking && booking.extendedProps.userId === userId) {
		return next();
	} else {
		if (user_permission_level & ADMIN_PERMISSION) {
			return next();
		} else {
			return res.status(403).send();
		}
	}
};

exports.hasBookingValidFields = (req, res, next) => {
	let errors = [];

	if (req.body) {
		if (!req.body.start) {
			errors.push('Missing start field');
		}
		if (!req.body.end) {
			errors.push('Missing end field');
		}
		if (!req.body.extendedProps) {
			errors.push('Missing extendedProps field');
		} else {
			if (!req.body.extendedProps.userId) {
				errors.push('Missing extendedProps.userId field');
			}
		}

		if (errors.length) {
			return res.status(400).send({ errors: errors.join(',') });
		} else {
			return next();
		}
	} else {
		return res.status(400).send({ errors: 'Missing booking fields' });
	}
};

getMaximumBookingsPerUser = () => {
	return config.has('bookings.max_bookings_per_user') ? config.get('bookings.max_bookings_per_user') : 2;
};

exports.lessThanMaximumBookings = (req, res, next) => {
	const maximumBookings = getMaximumBookingsPerUser();
	const id = req.body.id ? req.body.id : 0;
	const userId = req.body.extendedProps.userId;

	BookingsModel.findByUserId(userId).then((result) => {
		if (
			Array.isArray(result) &&
			result.length >= 0 &&
			result.filter((elem) => elem.id !== id).length < maximumBookings
		) {
			return next();
		} else {
			return res.status(400).send({ errors: 'Maximum bookings per user reached' });
		}
	});
};

getMaximumBookingTime = () => {
	return config.has('bookings.max_booking_time_hours') ? config.get('bookings.max_booking_time_hours') : 4;
};

exports.isBookingTimeValid = (req, res, next) => {
	const start = moment(req.body.start);
	const end = moment(req.body.end);
	const maximumBookingTime = getMaximumBookingTime();
	let errors = [];
	if (moment().isAfter(start)) {
		errors.push('Start time not valid');
	}
	if (moment().isAfter(end)) {
		errors.push('End time not valid');
	}
	if (start.isSameOrAfter(end)) {
		errors.push('Time interval not valid');
	}

	if (moment.duration(end.diff(start)).asHours() > maximumBookingTime) {
		errors.push('Maximum booking time exceeded');
	}

	if (errors.length) {
		return res.status(400).send({ errors: errors.join(', ') });
	} else {
		return next();
	}
};

exports.isBookingTimeFree = (req, res, next) => {
	const id = req.body.id ? req.body.id : 0;
	BookingsModel.findCollisions(req.body).then((collisions) => {
		if (collisions && Array.isArray(collisions) && collisions.filter((elem) => elem.id !== id).length == 0) {
			return next();
		} else {
			return res.status(400).send({ errors: 'Collision in given booking time' });
		}
	});
};

exports.getBookingData = (req, res, next) => {
	BookingsModel.findById(req.params.bookingId)
		.then((result) => {
			req.body = result;
			return next();
		})
		.catch((result) => {
			res.status(204).send({});
		});
};
exports.currentOrFutureEvent = (req, res, next) => {
	const event = req.body;
	if (isFutureEvent(event) || isCurrentEvent(event)) {
		return next();
	} else {
		return res.status(400).send({ errors: 'Invalid Event' });
	}
};
isFutureEvent = (event) => {
	const start = moment(event.start);
	return moment().isBefore(start);
};

isPastEvent = (event) => {
	const end = moment(event.start);
	return moment().isAfter(end);
};

isCurrentEvent = (event) => {
	const start = moment(event.start);
	const end = moment(event.start);
	return moment().isAfter(start) && moment().isBefore(end);
};
