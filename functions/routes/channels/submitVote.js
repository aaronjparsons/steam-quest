const getSteamLibrary = require('../../helpers/getSteamLibrary')
const buildTopVotes = require('../../helpers/buildTopVotes')

module.exports =  async (req, res) => {
  const channelId = req.params.channelId

  try {
    const channel = await req.app.locals.db.collection('channels').doc(channelId).get()
    let data = channel.data()

    const votes = data.votes
    const appid = req.body.appid
    const voteCount = req.body.votes
    const user = res.locals.userId
    let userVoteTotal = voteCount

    if (votes[appid]) {
      if (votes[appid][user]) {
        // Add to existing vote count
        votes[appid][user] += voteCount
        userVoteTotal = votes[appid][user]
      } else {
        // Create new user vote count
        votes[appid][user] = voteCount
      }
    } else {
      // Create new game property
      const userVote = {}
      userVote[user] = voteCount
      votes[appid] = userVote
    }

    // Update votes with new vote
    await req.app.locals.db.collection('channels').doc(channelId).update({ votes })

    // Recalculate top games
    data = { ...data, votes }
    const topGames = buildTopVotes(data)
    await req.app.locals.db.collection('channels').doc(channelId).update({ topGames })

    // Return updated panelstats
    const game = data.library.find(app => app.appid == appid)
    const viewerVote = {
      game: game.name,
      votes: userVoteTotal
    }

    res.status(200).json({ viewerVote, topGames })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error
    })
  }
}