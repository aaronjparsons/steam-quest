const buildLibrary = require('../../helpers/buildLibrary')
const getSteamLibrary = require('../../helpers/getSteamLibrary')

// current game name + date started
// Top 3 game names + vote count
// If viewer has voted, game voted for and vote count

module.exports = async (req, res) => {
  const channelId = req.params.channelId
  const user = res.locals.userId

  try {
    const channel = await req.app.locals.db.collection('channels').doc(channelId).get()

    if (!channel.exists) {
      res.status(404).send()
    }

    const data = channel.data()
    const stats = {
      channelId: data.id,
      current: data.current,
      topGames: data.topGames,
      bitsEnabled: data.bitsEnabled,
      viewerVote: null,
    }

    // Stats
    for (const [key, value] of Object.entries(data.votes)) {
      // Get viewerVote
      if (value[user]) {
        const game = data.library.find(app => app.appid == key)
        stats.viewerVote = {
          game: game.name,
          votes: value[user]
        }
      }
    }

    // Library
    const { library, completed } = await buildLibrary(data);

    res.status(200).json({ stats, library, completed })
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}