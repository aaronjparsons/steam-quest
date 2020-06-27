const channels = require('express').Router()
const createChannel = require('./createChannel')
const getChannel = require('./getChannel')
const updateChannel = require('./updateChannel')
const getRawLibrary = require('./getRawLibrary')

channels.post('/', createChannel)
channels.get('/:channelId', getChannel)
channels.patch('/:channelId', updateChannel)
channels.get('/:channelId/steamlibrary', getRawLibrary)

module.exports = channels