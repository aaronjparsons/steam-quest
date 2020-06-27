const routes = require('express').Router()
const channels = require('./channels')

routes.use('/channels', channels)

module.exports = routes