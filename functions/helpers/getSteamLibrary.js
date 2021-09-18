const functions = require('firebase-functions')
const axios = require('axios')

module.exports = async (steamId, appFilters = null) => {
  const params = {
    input_json: {
      steamid: steamId,
      include_appinfo: 'true',
    }
  }

  if (appFilters && appFilters.length) {
    params.input_json = {
      ...params.input_json,
      appids_filter: appFilters
    }
  }

  const response = await axios.get(
    `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${
      functions.config().steamquest.steamkey
    }`,
    { params }
  )
  const sorted = response.data.response.games.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  return sorted
}