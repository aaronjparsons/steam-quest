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
    const response = {
      channelId: data.id,
      current: data.current,
      viewerVote: null,
      topGames: []
    }

    const voteTotals = []

    for (const [key, value] of Object.entries(data.votes)) {
      // Get viewerVote
      if (value[user]) {
        response.viewerVote = true
      }
      // Top games
      const gameVotes = Object.values(value).reduce((a, b) => a + b)
      voteTotals.push({
        appid: key,
        total: gameVotes
      })
    }

    response.topGames = voteTotals.sort((a, b) => b.total - a.total).slice(0, 3)

    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}