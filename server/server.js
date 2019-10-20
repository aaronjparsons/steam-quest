const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')
const steam = require('./steam-helper')
const Game = require('./db/models/game')
const User = require('./db/models/user')
const UserVote = require('./db/models/userVote')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN
}
app.use(cors(corsOptions))

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

// GAME ROUTES //

app.get('/refreshGameList', async (req, res) => {
  const gamesAdded = []
  const steamLibrary = await steam.library()
  const query = Game.find()
  const dbGames = await query.exec()
  const dbGamesIds = dbGames.map(game => game.appid)
  for (const game of steamLibrary) {
    const isTracked = dbGamesIds.includes(game.appid)
    if (!isTracked) {
      console.log(`Adding ${game.name}`)
      const newGame = new Game({
        appid: game.appid,
        name: game.name,
        playtime_forever: game.playtime_forever,
        img_icon_url: game.img_icon_url,
        img_logo_url: game.img_logo_url,
        completed: false,
        ignored: false,
        votes: 0
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

app.get('/topGames', async (req, res) => {
  const query = Game.where('votes')
    .gte(1)
    .find()
  const dbGames = await query.exec()
  const top = dbGames
    .sort((a, b) => {
      return b.votes - a.votes
    })
    .slice(0, 5)
  res.send({
    success: true,
    games: top
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

// VOTE ROUTES //

app.post('/submitVote', async (req, res) => {
  const appid = req.body.appid
  const query = Game.where({ appid }).findOne()
  const game = await query.exec()
  if (game) {
    game.votes++
    const saved = await game.save()
    if (saved) {
      res.send({
        success: true,
        game: game.name
      })
    } else {
      res.send({
        success: false
      })
    }
  } else {
    res.send({
      success: false,
      message: 'Invalid appid'
    })
  }
})

app.post('/clearVotes', async (req, res) => {
  // Reset all game votes to 0
  const gameVotes = await Game.updateMany({ votes: { $gt: 0 } }, { votes: 0 })
  // Delete all user votes
  const userVotes = await UserVote.deleteMany({})
  if (gameVotes.ok && userVotes.ok) {
    res.send({
      success: true
    })
  }
})

// USER VOTES ROUTE //
app.post('/userVote', async (req, res) => {
  const user = req.body.user
  const appid = req.body.appid

  const userVote = new UserVote({
    appid,
    user
  })

  const userVoteSaved = await userVote.save()

  if (userVoteSaved) {
    // Document exists, user already voted
    res.send({
      success: true
    })
  } else {
    res.send({
      success: false
    })
  }
})

app.get('/userVote/:name', async (req, res) => {
  const user = req.params.name
  const query = UserVote.where({ user }).findOne()
  const game = await query.exec()

  if (game) {
    // Document exists, user already voted
    res.send({
      success: true,
      voted: true
    })
  } else {
    res.send({
      success: true,
      voted: false
    })
  }
})

// AUTHENTICATION ROUTES //
app.post('/register', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  bcrypt.hash(password, 10, async function(err, hash) {
    // Store hash in your password DB.
    const user = new User({
      username,
      password: hash
    })

    const userSaved = await user.save()

    if (userSaved) {
      res.send({
        success: true
      })
    } else {
      res.send({
        success: false
      })
    }
  })
})

app.post('/login', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const query = User.where({ username }).findOne()
  const userData = await query.exec()

  if (userData) {
    const passwordMatch = await bcrypt.compare(password, userData.password)
    if (passwordMatch) {
      res.send({
        success: true
      })
    } else {
      res.send({
        success: false,
        message: 'Incorrect Username or Password'
      })
    }
  } else {
    res.send({
      success: false,
      message: 'Incorrect Username or Password'
    })
  }
})

const port = 3000
app.listen(port, () => console.log(`Server listening on port ${port}!`))
