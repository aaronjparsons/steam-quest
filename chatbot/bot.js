const tmi = require('tmi.js')
const axios = require('axios')
require('dotenv').config()

// Setup axios
const API = axios.create({
  baseURL: 'http://localhost:3000'
})

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [process.env.CHANNEL_NAME]
}

// Create a client with our options
const client = new tmi.client(opts)

// Register our event handlers (defined below)
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)

// Connect to Twitch:
client.connect()

// Called every time a message comes in
async function onMessageHandler(target, context, msg, self) {
  // Ignore messages from the bot
  if (self) {
    return
  }

  // Ignore messages that don't begin with a '!'
  if (msg.trim().charAt(0) !== '!') {
    return
  }

  // Remove whitespace from chat message
  const command = msg.trim()

  // If the command is known, let's execute it
  if (command === '!top5') {
    client.say(target, 'Top 5 votes command')
  } else if (command.includes('!vote')) {
    const appid = command.split('-')[1]
    const user = context.username
    const displayName = context['display-name']
    const voted = await checkUserVote(user)

    if (voted) {
      client.say(
        target,
        `@${displayName}, you have already voted in this round.`
      )
    } else {
      const voted = await submitVote(appid, user)
      if (voted.success) {
        client.say(target, `${displayName} voted for ${voted}`)
      } else {
        client.say(target, `@${displayName} voting failed. ${voted.message}`)
      }
    }
  }
}

// Check if user has already voted
async function checkUserVote(user) {
  const response = await API.get(`/userVote/${user}`)
  return response.data.voted
}

// Submit a vote
async function submitVote(appid, user) {
  // Submit vote
  const vote = await API.post('/submitVote', {
    appid
  })
  if (vote.data.success) {
    const game = vote.data.game
    // Log vote for the user
    const voteLogged = await API.post('/userVote', {
      appid,
      user
    })

    if (voteLogged.data.success) {
      return {
        success: true,
        game
      }
    }
  } else {
    return {
      success: false,
      message: vote.data.message
    }
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
}
