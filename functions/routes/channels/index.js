const channels = require('express').Router()
const createChannel = require('./createChannel')
const getChannel = require('./getChannel')
const updateChannel = require('./updateChannel')
const getRawLibrary = require('./getRawLibrary')
const getPanelStats = require('./getPanelStats')

channels.post('/', createChannel)
channels.get('/:channelId', getChannel)
channels.patch('/:channelId', updateChannel)
channels.get('/:channelId/steamlibrary', getRawLibrary)
channels.get('/:channelId/panelstats', getPanelStats)

module.exports = channels