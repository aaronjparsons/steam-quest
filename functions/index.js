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

//define google cloud function name
exports.api = functions.https.onRequest(app)