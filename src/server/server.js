const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const PayPalStrategy = require("passport-paypal-oauth").Strategy;
const query = require("./query.js");
app.use(passport.initialize());
app.use(passport.session());
const port = 8080;

app.use(bodyParser.json());

const db = require("./db");
db.connect();

// passport.serializeUser(function(user, done) {
//     done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//     done(null, obj);
// });

passport.use(
  new PayPalStrategy(
    {
      clientID:
        "AV7_EMdAE2gA0Zoi1KKNjj40_Lw7YgiMVOVKY5C5gOZ9nCx45XFCQcCzJCxZ4lzXKLFZquabvZFYYo8a",
      clientSecret:
        "EL0U92Tlxzt_IrXc_CQ7SAG3ntJQHULg_T-IqofxkSxedf73HNxQCINNkxGdY9XhsQ0FNng3VCaY8o-b",
      callbackURL: "http://localhost:3000/auth/paypal",
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(accessToken, profile);
      // User.findOrCreate({ paypalId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
      query.findUser(db, profile.id);
    }
  )
);
//111111111

require("./routes")(app, passport, db);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
