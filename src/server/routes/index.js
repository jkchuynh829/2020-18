const authRoutes = require('./authRoutes.js');
const apiRoutes = require('./apiRoutes.js');
const payRoutes = require('./payRoutes.js');

module.exports = function(app, passport, db, paypal) {
    authRoutes(app, passport, db);
    apiRoutes(app, db);
    payRoutes(app, paypal);
}