require('dotenv').config()
const axios = require('axios')

const library = async () => {
  try {
    const response = await axios.get(
      `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${
        process.env.STEAM_API_KEY
      }`,
      {
        params: {
          steamid: process.env.STEAM_ACCOUNT_ID,
          format: 'json',
          include_appinfo: 'true'
        }
      }
    )
    return response.data.response.games
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  library
}
