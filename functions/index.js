const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")
const auth = require('./middleware/auth')
const axios = require('axios')

//initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase)

//initialize express server
const app = express()

app.use(cors())
app.use(auth)

//add the path to receive request and set json as bodyParser to process the body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//initialize the database and the collection
const db = admin.firestore()

// Get broadcaster channel (config)
app.get('/channels/:channelId', async (req, res) => {
  const channelId = req.params.channelId

  try {
    // Only the owner of the channel may access this route
    if (!res.locals.userId || res.locals.userId !== channelId) {
      res.status(401).json({
        error: 'Not Authorized'
      })
    }

    const channel = await db.collection('channels').doc(channelId).get()

    if (channel.exists) {
      res.status(200).json({
        id: channel.id,
        ...channel.data()
      })
    } else {
      res.status(200).json({})
    }
  } catch (error) {
    res.status(500).send(error)
  }
})

// Save broadcaster channel (config)
app.post('/channels', async (req, res) => {
  try {
    const channel = await db.collection('channels').doc(req.body.id).set({
      steamId: req.body.steamId,
      ignored: req.body.ignored,
      previouslyCompleted: req.body.previouslyCompleted,
      completed: req.body.completed
    })
    res.status(201).send()
  } catch (error) {
    res.status(500).send(error)
  }
})

// Update broadcaster channel (config)
app.patch('/channels/:channelId', async (req, res) => {
  const channelId = req.params.channelId

  try {
    const channel = await db.collection('channels').doc(channelId).update(req.body)
    res.status(200).send()
  } catch (error) {
    res.status(500).json({
      error
    })
  }
})

// Get broadcaster library
app.get('/channels/:channelId/library', async (req, res) => {
  const channelId = req.params.channelId

  try {
    const channel = await db.collection('channels').doc(channelId).get()
    const response = await axios.get(
      `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${
        functions.config().steamquest.steamkey
      }`,
      {
        params: {
          steamid: channel.data().steamId,
          format: 'json',
          include_appinfo: 'true'
        }
      }
    )
    const sorted = response.data.response.games.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
    res.status(200).json(sorted)
  } catch (error) {
    res.status(500).send(error)
  }
})

//define google cloud function name
exports.api = functions.https.onRequest(app)