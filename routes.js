const express = require("express");
const router = express.Router();
const User = require("./models/user");
const users = require('./controllers/userController.js');
const polls = require('./controllers/pollController.js');

// authentication middleware
const requireUser = async (req, res, next) => {
  const userId = req.session.userId;
  if (userId) {
    const user = await User.findOne({ _id: userId });
    res.locals.user = user;
    next();
  } else {
    return res.redirect("/login");
  }
};

// user routes //

// get register
router.get("/register", users.getRegister);

// post register
router.post("/register", users.postRegister);

// get login
router.get("/login", users.getLogin);

// post login
router.post("/login", users.postLogin);

// get logout
router.get("/logout", users.getLogout);




// poll routes //

// get index
router.get("/", polls.getIndex);

// get new
router.get("/new", requireUser, polls.getNew);

// post New
router.post("/new", polls.postNew);

// get delete
router.get("/polls/:id/delete", polls.getDelete);

// get show
router.get("/polls/:id/show", polls.getShow);

// post vote
router.post("/polls/:id/vote", polls.postVote);

// get results
router.get("/polls/:id/results", polls.getResults);




module.exports = router;