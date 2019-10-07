const mongoose = require('mongoose')

const userVoteSchema = new mongoose.Schema({
  appid: Number,
  user: String
})

module.exports = mongoose.model('UserVote', userVoteSchema, 'user-votes')
