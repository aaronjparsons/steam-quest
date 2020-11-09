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
    const steamLibrary = await getSteamLibrary(data.steamId)
    const stats = {
      channelId: data.id,
      current: data.current,
      viewerVote: null,
      topGames: []
    }

    // Stats
    const voteTotals = []

    for (const [key, value] of Object.entries(data.votes)) {
      // Get viewerVote
      if (value[user]) {
        const game = steamLibrary.find(app => app.appid == key)
        stats.viewerVote = {
          game: game.name,
          votes: value[user]
        }
      }
      // Top games
      const gameVotes = Object.values(value).reduce((a, b) => a + b)
      voteTotals.push({
        appid: key,
        total: gameVotes
      })
    }

    stats.topGames = voteTotals.sort((a, b) => b.total - a.total).slice(0, 3)
    stats.topGames = stats.topGames.map(game => {
      const app = steamLibrary.find(app => app.appid == game.appid)
      return {
        ...game,
        name: app.name
      }
    })

    // Library
    const { library, completed } = await buildLibrary(data, steamLibrary);

    res.status(200).json({
      stats,
      library,
      completed
    })
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}