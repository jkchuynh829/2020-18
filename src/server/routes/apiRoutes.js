module.exports = function(app, db) {
    db.connect();

    app.post('/savings_accounts', (req, res) => {        
        let query = 'INSERT INTO loans(user_id, loan_id, amount, term_length, term_rate, created_at, updated_at) VALUES($1, $2, $3, $4, $5, now(), now())'
        let body = req.body
        let insert_values = [body.user_id, body.loan_id, body.amount, body.termLength, body.termRate]
        db.query(query, insert_values, (err, result) => {
            if (err) {
                console.log(`CREATE SAVING CERTIFICATE ERROR: ${err}`);
                res.status(500).end()
            } else {
                res.status(201).json(result).end()
            }
        });
    });

    app.get('/:user_id/savings_accounts', (req, res) => {
        let query = 'SELECT * FROM savings_accounts WHERE user_id = $1'
        let user_id = req.params["user_id"]

        db.query(query, [user_id], (err, result) => {
            if (err) {
                console.log(`GET USER SAVINGS ACCOUNTS ERROR: ${err}`);
                res.status(500).end()
            } else {
                res.status(200).json(result).end()
            }
        });
    });

    app.post('/loans', (req, res) => {        
        let query = 'INSERT INTO saving_certificates(amount, purpose, term_length, term_rate, created_at, updated_at) VALUES($1, $2, $3, $4, now(), now())'
        let body = req.body
        let insert_values = [body.amount, body.purpose, body.termLength, body.termRate]
        db.query(query, insert_values, (err, result) => {
            if (err) {
                console.log(`CREATE LOAN ERROR: ${err}`);
                res.status(500).end()
            } else {
                res.status(201).json(result).end()
            }
        });
    });
    
    app.get('/loans/:id', (req, res) => {
        let query = 'SELECT * FROM loans WHERE id = $1'
        let user_id = req.params["id"]

        db.query(query, [user_id], (err, result) => {
            if (err) {
                console.log(`GET LOAN ERROR: ${err}`);
                res.status(500).end()
            } else {
                res.status(200).json(result).end()
            }
        });
    });

    app.get('/:user_id/loans', (req, res) => {
        let query = 'SELECT * FROM loans WHERE user_id = $1'
        let user_id = req.params["user_id"]

        db.query(query, [user_id], (err, result) => {
            if (err) {
                console.log(`GET USER LOANS ERROR: ${err}`);
                res.status(500).end()
            } else {
                res.status(200).json(result).end()
            }
        });
    });
}


// function ensureAuthenticated(req, res, next) {
// if (req.isAuthenticated()) { return next(); }
// res.redirect('/login')
// }