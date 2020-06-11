const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")

//initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase)

//initialize express server
const app = express()

app.use(cors())

//add the path to receive request and set json as bodyParser to process the body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//initialize the database and the collection
const db = admin.firestore()

// Get broadcaster (config)
app.get('/users/:userId', async (req, res) => {
  const userId = req.params.userId

  try {
    const user = await db.collection('users').doc(userId).get()

    if (user.exists) {
      res.status(200).json({
        id:user.id,
        data:user.data()
      })
    } else {
      res.status(200).json({})
    }
  } catch (error) {
    res.status(500).send(error)
  }
})

// Save broadcaster (config)
app.post('/users', async (req, res) => {
  try {
    await db.collection('users').doc(req.body.id).set({
      steamId: req.body.steamId
    })
    res.status(201).send()
  } catch (error) {
    res.status(500).send(error)
  }

})

//define google cloud function name
exports.api = functions.https.onRequest(app)