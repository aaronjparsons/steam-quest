// current game name + date started
// Top 3 game names + vote count
// If viewer has voted, game voted for and vote count

module.exports = async (req, res) => {
  const channelId = req.params.channelId
  const response = {
    currentGame: {
      name: null,
      started: null
    },
    topGames: [],
    viewerVote: null
  }

  try {
    const channel = await req.app.locals.db.collection('channels').doc(channelId).get()

    if (channel.data().current.appid) {
      response.currentGame = channel.data().current
    }

    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}