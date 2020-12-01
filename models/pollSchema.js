const mongoose = require('mongoose');


const PollSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true
  },
  description: {
   type: String,
   required: true 
  },
  created_by: { 
    type: String,
    required:true 
  },
  options: [{ 
    name: { type: String, required: true }, 
    votes: { type: Number, default: 0 } 
  }]
});

PollSchema.methods.percentage = function(){
  var totalVotes = this.options[0].votes+this.options[1].votes;
  var percentage = this.options.map(i => Math.round((i.votes*100)/totalVotes));
  return percentage
};



module.exports = PollSchema;

