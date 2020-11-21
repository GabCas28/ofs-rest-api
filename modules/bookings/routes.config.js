const BookingsController = require('./controllers/bookings.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const BookingsMiddleware = require('./middlewares/verify.booking.middleware');
const config = require('../common/config/env.config');

exports.routesConfig = function(app) {
	app.post('/bookings', [
		ValidationMiddleware.validJWTNeeded,
		PermissionMiddleware.activeUserRequired,
		BookingsMiddleware.hasBookingValidFields,
		BookingsMiddleware.onlySameUserOrAdminCanDoThisAction,
		BookingsMiddleware.isBookingTimeValid,
		BookingsMiddleware.isBookingTimeFree,
		BookingsMiddleware.lessThanMaximumBookings,
		BookingsController.insert
	]);
	app.get('/bookings', [ ValidationMiddleware.validJWTNeeded, BookingsController.list ]);
	app.get('/bookings/current', [ ValidationMiddleware.validJWTNeeded, BookingsController.getCurrent ]);
	app.patch('/bookings/:bookingId', [
		ValidationMiddleware.validJWTNeeded,
		PermissionMiddleware.activeUserRequired,
		BookingsMiddleware.hasBookingValidFields,
		BookingsMiddleware.onlySameUserOrAdminCanDoThisAction,
		BookingsMiddleware.isBookingTimeValid,
		BookingsMiddleware.isBookingTimeFree,
		BookingsMiddleware.lessThanMaximumBookings,
		BookingsController.patchById
	]);
	app.delete('/bookings/:bookingId', [
		ValidationMiddleware.validJWTNeeded,
		PermissionMiddleware.activeUserRequired,
		BookingsMiddleware.onlySameUserOrAdminCanDoThisAction,
		BookingsMiddleware.getBookingData,
		BookingsMiddleware.currentOrFutureEvent,
		BookingsController.removeById
	]);
};
