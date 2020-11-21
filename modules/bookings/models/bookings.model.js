const moment = require('moment');

const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const bookingsSchema = new Schema({
	start: Date,
	end: Date,
	extendedProps: {
		userId: String
	}
});

bookingsSchema.virtual('id').get(function() {
	return this._id.toHexString();
});

// Ensure virtual fields are serialised.
bookingsSchema.set('toJSON', {
	virtuals: true
});

bookingsSchema.findById = function(cb) {
	return this.model('Bookings').find({ id: this.id }, cb);
};

const Booking = mongoose.model('Bookings', bookingsSchema);

exports.findCurrent = () => {
	return Booking.findOne({ start: { $lt: moment.now() }, end: { $gt: moment.now() } }).then((result) => {
		return result;
	});
};

exports.findCollisions = async (bookingData) => {
	collisions = [];
	const start = moment(bookingData.start);
	const end = moment(bookingData.end);
	await Booking.find({
		start: { $lt: start },
		end: { $gt: start }
	}).then((result) => collisions.push(...result));
	await Booking.find({
		start: { $lt: end },
		end: { $gt: end }
	}).then((result) => collisions.push(...result));
	await Booking.find({
		start: { $gte: start },
		end: { $lte: end }
	}).then((result) => collisions.push(...result));
	await Booking.find({
		start: { $lte: start },
		end: { $gte: end }
	}).then((result) => collisions.push(...result));

	return collisions;
};

exports.findById = (id) => {
	return Booking.findById(id).then((result) => {
		result = result.toJSON();
		delete result._id;
		delete result.__v;
		return result;
	});
};

exports.findByUserId = (id) => {
	return Booking.find({ start: { $gte: moment.now() }, 'extendedProps.userId': id }).then((result) => {
		return result;
	});
};

exports.createBooking = (bookingData) => {
	const booking = new Booking(bookingData);
	return booking.save();
};

exports.list = (perPage, page) => {
	return new Promise((resolve, reject) => {
		Booking.find().exec(function(err, users) {
			if (err) {
				reject(err);
			} else {
				resolve(users);
			}
		});
	});
};

exports.patchBooking = (id, bookingData) => {
	return new Promise((resolve, reject) => {
		Booking.findById(id, function(err, booking) {
			if (err) reject(err);
			for (let i in bookingData) {
				booking[i] = bookingData[i];
			}
			booking.save(function(err, updatedBooking) {
				if (err) return reject(err);
				resolve(updatedBooking);
			});
		});
	});
};

exports.removeById = (bookingId) => {
	return new Promise((resolve, reject) => {
		Booking.deleteOne({ _id: bookingId }, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(err);
			}
		});
	});
};
