const mongoose = require('mongoose')

const userVoteSchema = new mongoose.Schema(
  {
    appid: Number,
    user: String
  },
  { timestamps: true }
)

module.exports = mongoose.model('UserVote', userVoteSchema, 'user-votes')
