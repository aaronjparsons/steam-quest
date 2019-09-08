const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const steam = require('./steam-helper')
const Game = require('./db/models/game')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = 3000

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Database connection successful')
  })
  .catch(err => {
    console.error('Database connection error')
  })

app.get('/refreshGameList', async (req, res) => {
  const gamesAdded = []
  const steamLibrary = await steam.library()
  const query = Game.find()
  const dbGames = await query.exec()
  const dbGamesIds = dbGames.map(game => game.appid)
  for (const game of steamLibrary) {
    const isTracked = dbGamesIds.includes(game.appid)
    if (!isTracked) {
      const newGame = new Game({
        appid: game.appid,
        name: game.name,
        playtime_forever: game.playtime_forever,
        img_icon_url: game.img_icon_url,
        img_logo_url: game.img_logo_url,
        completed: false
      })

      const savedGame = await newGame.save()
      gamesAdded.push(savedGame)
    }
  }

  if (gamesAdded.length) {
    res.send({
      success: true,
      gamesAdded
    })
  } else {
    res.send({
      success: true,
      message: 'No new games added'
    })
  }
})

app.get('/gameLibrary', async (req, res) => {
  const query = Game.find()
  const dbGames = await query.exec()
  res.send({
    success: true,
    games: dbGames
  })
})

app.post('/markGameCompleted', async (req, res) => {
  const appid = req.body.appid
  const query = Game.findOneAndUpdate(
    { appid },
    { completed: true },
    { new: true }
  )
  const result = await query.exec()
  res.send({
    success: true,
    result
  })
})

app.listen(port, () => console.log(`Server listening on port ${port}!`))
