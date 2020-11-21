const config = require('./modules/common/config/env.config.js');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const AuthorizationRouter = require('./modules/authorization/routes.config');
const UsersRouter = require('./modules/users/routes.config');
const ActivationRouter = require('./modules/activation/routes.config');
const RecoveryRouter = require('./modules/recovery/routes.config');
const BookingsRouter = require('./modules/bookings/routes.config');

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
	res.header('Access-Control-Expose-Headers', 'Content-Length');
	res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
	if (req.method === 'OPTIONS') {
		return res.send(200);
	} else {
		console.log('URL:', req.method, req.url);
		return next();
	}
});

app.use(bodyParser.json());
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
ActivationRouter.routesConfig(app);
RecoveryRouter.routesConfig(app);
BookingsRouter.routesConfig(app);

app.listen(config.port, function() {
	console.log('app listening at port %s', config.port);
});
