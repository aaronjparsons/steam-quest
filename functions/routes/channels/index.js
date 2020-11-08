const channels = require('express').Router()
const createChannel = require('./createChannel')
const getChannel = require('./getChannel')
const updateChannel = require('./updateChannel')
const getRawLibrary = require('./getRawLibrary')
const getPanelStats = require('./getPanelStats')
const getLibrary = require('./getLibrary')
const submitVote = require('./submitVote')

channels.post('/', createChannel)
channels.get('/:channelId', getChannel)
channels.patch('/:channelId', updateChannel)
channels.get('/:channelId/steamlibrary', getRawLibrary)
channels.get('/:channelId/library', getLibrary)
channels.get('/:channelId/panelstats', getPanelStats)
channels.post('/:channelId/vote', submitVote)

module.exports = channels