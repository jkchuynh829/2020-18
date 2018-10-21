module.exports = function(app, passport, db) {
    db.connect();

    app.post('/login', passport.authenticate('paypal', ), (req, res) => {
        res.redirect('/')
    });

    app.post('/users', passport.authenticate('paypal', ), (req, res) => {
        res.redirect('/')
    });

    app.get('/auth/paypal/callback',
        passport.authenticate('paypal', { failureRedirect: '/' }),
        (req, res) => {
            res.redirect('/');
        }
    )
}