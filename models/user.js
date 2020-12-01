const mongoose = require("mongoose");
const UserSchema = require("./userSchema");


require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/polls', { useNewUrlParser: true });
mongoose.connection.on("error", function(e){ console.error(e); });
const db = mongoose.connection;



module.exports = mongoose.model("User", UserSchema);