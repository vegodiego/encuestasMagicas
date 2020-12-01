const express = require("express");
const cookieSession = require('cookie-session')
const mongoose = require("mongoose");
const routes = require("./routes");
var expressLayouts = require("express-ejs-layouts");
const flash = require('connect-flash');


const app = express();


app.set('trust proxy', 1); // trust first proxy
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(process.cwd() + "/public"));

app.set("view engine", "ejs");

app.use(expressLayouts);

app.use(flash());

app.use(function(req, res, next){
 res.locals.success= req.flash('success');
 next();
});

app.use("/", routes);




module.exports = app;