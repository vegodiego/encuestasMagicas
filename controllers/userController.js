const User = require("../models/user");


// get register
exports.getRegister = async (req, res) => {
  const userId = req.session.userId;
  var user = await User.findOne({ _id: userId });
  res.render("users/register", { user:user, error:null });
};

// post register
exports.postRegister = async (req, res) => {
  var newUser = new User({ email: req.body.email, password: req.body.password });
  const userId = req.session.userId;
  var user = await User.findOne({ _id: userId });
  newUser.save(function(err) {
    if (err) {
      console.log(err.message);
      return res.render('users/register', {user:user, error:"The email already exists" });
    }
    else{
      res.render("users/login", { user:user, error:null });
    }
  });
};

// get login
exports.getLogin = async  (req, res) => {
  const userId = req.session.userId;
  var user = await User.findOne({ _id: userId });
  res.render("users/login", { error: null, user:user });
};

// post login
exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const userId = req.session.userId;
  var user = await User.findOne({ _id: userId });
  try {
    const user = await User.authenticate(email, password);
    if (user) {
      req.session.userId = user._id;
      return res.redirect("/");
    } else {
      res.render("users/login", { error: "Tu email y/o contraseña son inválidas. Intenta nuevamente.", user:user  });
    }
  } catch (e) {
    return next(e);
  }
};

// get logout
exports.getLogout = (req, res) => {
  req.session.userId = null;
  res.redirect("/login");
};