const functions = require('firebase-functions')
const axios = require('axios')

module.exports = async (steamId) => {
  const response = await axios.get(
    `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${
      functions.config().steamquest.steamkey
    }`,
    {
      params: {
        steamid: steamId,
        format: 'json',
        include_appinfo: 'true'
      }
    }
  )
  const sorted = response.data.response.games.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  return sorted
}