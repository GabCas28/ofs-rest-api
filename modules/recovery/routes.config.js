const RecoveryController = require('./controllers/recovery.controller');
const UsersController = require('../users/controllers/users.controller');
const RecoveryMiddleware = require('./middlewares/recovery.middleware');

exports.routesConfig = function(app) {
	app.get('/recovery/sendemail/:email', [
		// ActivationMiddleware.confirmHostOrigin,
		RecoveryMiddleware.addCode,
		RecoveryController.sendRecoveryEmail
	]);

	app.post('/recovery/:recoveryCode', [
		RecoveryMiddleware.checkById,
		RecoveryMiddleware.removeById,
		UsersController.patchById
	]);
};
