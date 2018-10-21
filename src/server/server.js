const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const PayPalStrategy = require('passport-paypal-oauth').Strategy;
const query = require('./query.js')
app.use(passport.initialize());
app.use(passport.session());
const port = 8080;

app.use(bodyParser.json());

const db = require('./db');

// passport.serializeUser(function(user, done) {
//     done(null, user);
// });
  
// passport.deserializeUser(function(obj, done) {
//     done(null, obj);
// });

passport.use(new PayPalStrategy({
    clientID: "AbDmwqwWHQti9LVG60_R3dxfknfSc1FPLOy02abCRxyyN6PXvxltxO3Rwls1f5pcwXkPGlCo9b63oLnq",
    clientSecret: "ELGwqN3AMw3eX2tafGhBoElE00SwAP0fxBy5eJaIsnCaD_aohtLNXuW0RvXMPheiIJPh0wEnuGOF4A1j",
    callbackURL: "http://760886d3.ngrok.io/auth/paypal/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ paypalId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    query.findUser(db, profile.id);
  }
));

require ('./routes')(app, passport, db);

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) 