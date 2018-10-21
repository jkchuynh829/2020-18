function findUser(db, paypalID) {
    db.connect();

    const query = {
        name: 'find-user',
        text: "SELECT * FROM USERS WHERE paypal_id = $1 LIMIT 1",
        values: [paypalID]
    }

    db.query(query, (err, result) => {
        if (err) {
            console.log("User query error: " + err);
        } else {
            if (result["rows"].length == 0) {
                
                const query = {
                    name: 'find-user',
                    text: "INSERT INTO users(paypal_id, created_at, updated_at) VALUES($1, now(), now())",
                    values: [paypalID]
                }

                db.query(query, (err, result) => {
                    return done(err, result);
                });
            } else { 
                return done(err, result);
            }
        }
    });
}

module.exports = {
    findUser: findUser
}