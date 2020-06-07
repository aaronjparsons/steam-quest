const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const bodyParser = require("body-parser")

//initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase)

//initialize express server
const app = express()

//add the path to receive request and set json as bodyParser to process the body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//initialize the database and the collection
const db = admin.firestore()

// Create new user
app.post('/users', async (req, res) => {
  try {
      const user = {
        firstName: req.body['firstName'],
        lastName: req.body['lastName']
      }

    const newDoc = await db.collection('users').add(user)
    res.status(201).send(`Created a new user: ${newDoc.id}`)
  } catch (error) {
    res.status(400).send(`User should cointain firstName, lastName!`)
  }
})

//define google cloud function name
exports.api = functions.https.onRequest(app)