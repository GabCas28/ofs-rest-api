const ActivationController = require('./controllers/activation.controller');
const UsersController = require('../users/controllers/users.controller');
const ActivationMiddleware = require('./middlewares/activation.middleware');
const config = require('../common/config/env.config');

exports.routesConfig = function(app) {
	app.get('/activation/sendemail/:email', [
		// ActivationMiddleware.confirmHostOrigin,
		ActivationMiddleware.insertCode,
		ActivationController.sendActivationEmail
	]);
	app.get('/activation/:codeId', [
		ActivationMiddleware.checkById,
		ActivationMiddleware.removeById,
		UsersController.patchById
	]);
};
