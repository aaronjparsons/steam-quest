const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
  appid: Number,
  name: String,
  playtime_forever: Number,
  img_icon_url: String,
  img_logo_url: String,
  completed: Boolean
})

module.exports = mongoose.model('Game', gameSchema, 'games')
