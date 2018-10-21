module.exports = function(app, db) {
  app.post("/create_user", (req, res) => {
    let query =
      "INSERT INTO users(user_type, first_name, last_name, email, password, business_name, description, location) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
    let body = req.body;
    let insert_values = [
      body.userType,
      body.firstName,
      body.lastName,
      body.email,
      body.password,
      body.businessName,
      body.description,
      body.location,
    ];
    db.query(query, insert_values, (err, result) => {
      if (err) {
        console.log(`CREATE USER ERROR: ${err}`);
        res.status(500).end();
      } else {
        return res
          .status(201)
          .json(result["rows"][0])
          .end();
      }
    });
  });

  app.get("/users", (req, res) => {
    let query;
    if (req.query.email != null) {
      query = {
        name: "find-user",
        text: `SELECT * FROM users WHERE email = $1`,
        values: [req.query.email],
      };
    } else {
      query = "SELECT * FROM users;";
    }

    db.query(query, (err, result) => {
        if (err) {
            console.log(`GET USERS ERROR: ${err}`);
            res.status(500).end()
        } else {
            res.status(200).json(result["rows"]).end()
        }
    });
  });

  app.post("/savings_accounts", (req, res) => {
    let query =
      "INSERT INTO savings_accounts(user_id, loan_id, amount, term_length, term_rate) VALUES($1, $2, $3, $4, $5) RETURNING *";
    let body = req.body;
    let insert_values = [
      body.userId,
      body.loanId,
      body.amount,
      body.termLength,
      body.termRate,
    ];
    db.query(query, insert_values, (err, result) => {
      if (err) {
        console.log(`CREATE SAVINGS ACCOUNTS ERROR: ${err}`);
        res.status(500).end();
      } else {
        res
          .status(201)
          .json(result["rows"][0])
          .end();
      }
    });
  });

  app.get("/:user_id/savings_accounts", (req, res) => {
    let query = "SELECT * FROM savings_accounts WHERE user_id = $1";
    let user_id = req.params["user_id"];

    db.query(query, [user_id], (err, result) => {
      if (err) {
        console.log(`GET USER SAVINGS ACCOUNTS ERROR: ${err}`);
        res.status(500).end();
      } else {
        res
          .status(200)
          .json(result["rows"])
          .end();
      }
    });
  });

  app.post("/loans", (req, res) => {
    let query =
      "INSERT INTO loans(user_id, title, amount, purpose, term_length, term_rate) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
    let body = req.body;
    let insert_values = [
      body.userId,
      body.title,
      body.amount,
      body.purpose,
      body.termLength,
      body.termRate,
    ];
    db.query(query, insert_values, (err, result) => {
      if (err) {
        console.log(`CREATE LOAN ERROR: ${err}`);
        res.status(500).end();
      } else {
        res
          .status(201)
          .json(result["rows"][0])
          .end();
      }
    });
  });

  app.get("/loans", (req, res) => {
    let query = "SELECT * FROM loans";

    db.query(query, (err, result) => {
      if (err) {
        console.log(`GET LOANS ERROR: ${err}`);
        res.status(500).end();
      } else {
        res
          .status(200)
          .json(result["rows"])
          .end();
      }
    });
  });

  app.get("/savings_accounts", (req, res) => {
    let query = "SELECT * FROM savings_accounts";

    db.query(query, (err, result) => {
      if (err) {
        console.log(`GET LOANS ERROR: ${err}`);
        res.status(500).end();
      } else {
        res
          .status(200)
          .json(result["rows"])
          .end();
      }
    });
  });

  app.get("/loans/:id", (req, res) => {
    let query = "SELECT * FROM loans WHERE id = $1 LIMIT 1";
    let id = req.params["id"];

    db.query(query, [id], (err, result) => {
      if (err) {
        console.log(`GET LOAN ERROR: ${err}`);
        res.status(500).end();
      } else {
        res
          .status(200)
          .json(result["rows"][0])
          .end();
      }
    });
  });

  app.get("/:user_id/loans", (req, res) => {
    let query = "SELECT * FROM loans WHERE loans.user_id = $1";
    let user_id = req.params["user_id"];

    db.query(query, [user_id], (err, result) => {
      if (err) {
        console.log(`GET USER LOANS ERROR: ${err}`);
        res.status(500).end();
      } else {
        res
          .status(200)
          .json(result["rows"])
          .end();
      }
    });
  });
};

// function ensureAuthenticated(req, res, next) {
// if (req.isAuthenticated()) { return next(); }
// res.redirect('/login')
// }
