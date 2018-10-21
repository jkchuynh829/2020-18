module.exports = function(app, passport, db) {
    app.post('/login', passport.authenticate('paypal', { failureRedirect: '/' }), (req, res) => {
        res.redirect('/');
    });

    app.post('/users', passport.authenticate('paypal', { failureRedirect: '/' }), (req, res) => {
        res.redirect('/');
    });

    app.get('/auth/paypal/callback',
        passport.authenticate('paypal', { failureRedirect: '/' }),
        (req, res) => {
            res.redirect('/');
        }
    )
}