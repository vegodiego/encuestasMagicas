const Poll = require("../models/poll");
const User = require("../models/user");

// get index
exports.getIndex = async (req, res) => {
  var polls = await Poll.find();
  const userId = req.session.userId;
  var user = await User.findOne({ _id: userId });
  if(user == null){
    user = {email:null};
  }
  res.render("polls/index",{polls:polls.reverse(), user:user.email}); 
};

// get new
exports.getNew = async (req, res) => {
  const userId = req.session.userId;
  var user = await User.findOne({ _id: userId });
  res.render("polls/new", { error: null, user:user });
};

// post new
exports.postNew = async (req, res) => {
  var poll =  new Poll(req.body);
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  poll.created_by = user.email;
  poll.save(function(err) {
    if (err) {
      console.log(err.message);
      return res.render('polls/new', {user:user});
    }
    else{
      req.flash('success','Poll Created successfully');
      res.redirect("/polls/"+poll._id+"/results");
    }
  });
};

// get delete
exports.getDelete = async (req, res) => {
  Poll.deleteOne({ _id: req.params.id }, function(err) {
    if (err) return console.error(err);
  });
  req.flash('success', 'Poll deleted successfully');
  res.redirect('/');
};

// get show
exports.getShow = async (req, res) => {
  const userId = req.session.userId;
  var user = await User.findOne({ _id: userId });
  poll = await Poll.findOne({ _id: req.params.id });
  res.render("polls/show", { poll: poll, user:user});
};

// post vote
exports.postVote = async (req, res) => {
  var poll = await Poll.findById(req.params.id);
  votes = poll.options[req.body.options].votes += 1;
  poll.options[req.body.options].votes = votes
  await poll.save();
  res.redirect("/polls/"+req.params.id+"/results");
};

// get results
exports.getResults = async (req, res) => {
  const userId = req.session.userId;
  var user = await User.findOne({ _id: userId });
  var poll = await Poll.findOne({ _id: req.params.id });
  var percentages = poll.percentage();
  res.render("polls/results", { poll: poll, percentages: percentages, user:user, alert:false});
};