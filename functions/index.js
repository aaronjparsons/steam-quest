const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const bodyParser = require("body-parser")
const auth = require('./middleware/auth')
const axios = require('axios')

// Initialize express server
const app = express()

app.use(cors())
app.use(auth)

// Add the path to receive request and set json as bodyParser to process the body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Connect all our routes to our application
app.use('/', routes)

// Initialize firebase and firestore and store it on in app locals
admin.initializeApp(functions.config().firebase)
app.locals.db = admin.firestore()

// Get broadcaster channel data
// app.get('/channels/:channelId/channel', async (req, res) => {
//   const channelId = req.params.channelId

//   try {
//     const channel = await db.collection('channels').doc(channelId).get()
//     const steamLibrary = await axios.get(
//       `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${
//         functions.config().steamquest.steamkey
//       }`,
//       {
//         params: {
//           steamid: channel.data().steamId,
//           format: 'json',
//           include_appinfo: 'true'
//         }
//       }
//     )

//     const library = steamLibrary.data.response.games.filter(item => {
//       item.completed = null
//       item.totalVotes = null
//       if (channel.data().previouslyCompleted.includes(item.appid)) {
//         item.completed = 'Previously Completed'
//       }
//       if (channel.data().votes[item.appid]) {
//         item.totalVotes = Object.values(channel.data().votes[item.appid]).reduce((a, b) => {
//           return a + b
//         }, 0)
//       }
//       return !channel.data().ignored.includes(item.appid)
//     }).sort((a, b) => {
//       return a.name.localeCompare(b.name)
//     })

//     res.status(200).json(library)
//   } catch (error) {
//     res.status(500).send(error)
//   }
// })

//define google cloud function name
exports.api = functions.https.onRequest(app)