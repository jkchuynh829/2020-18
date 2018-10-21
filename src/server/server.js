const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const PayPalStrategy = require("passport-paypal-oauth").Strategy;

const axios = require("axios");
const query = require("./query.js");
const paypal = require("paypal-rest-sdk");

app.use(passport.initialize());
app.use(passport.session());
const port = 8080;

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/credit", (req, res) => {
  // this token needs to be renewed every hour
  const authHeader = "Bearer De6cbmIUtAqcezKqnx1gH5gI8MI3mZfI";
  const headers = { headers: { Authorization: authHeader } };
  const URL = "https://api-stg.syf.com/m2020/credit/customers/2/profile";
  axios
    .get(URL, headers)
    .then(data => {
      res.status(200).json(JSON.stringify(data.data));
    })
    .catch(err => {
      console.log(err);
      return res.send(422);
    });
});

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

paypal.configure({
  mode: "sandbox",
  client_id:
    "AbDmwqwWHQti9LVG60_R3dxfknfSc1FPLOy02abCRxyyN6PXvxltxO3Rwls1f5pcwXkPGlCo9b63oLnq",
  client_secret:
    "ELGwqN3AMw3eX2tafGhBoElE00SwAP0fxBy5eJaIsnCaD_aohtLNXuW0RvXMPheiIJPh0wEnuGOF4A1j",
  headers: {
    custom: "header",
  },
});

require("./routes")(app, passport, db, paypal);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
