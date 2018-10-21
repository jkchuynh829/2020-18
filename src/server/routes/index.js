const authRoutes = require('./authRoutes.js');
const apiRoutes = require('./apiRoutes.js');

module.exports = function(app, passport, db) {
    authRoutes(app, passport, db);
    apiRoutes(app, db);
}