module.exports =  async (req, res) => {
  const channelId = req.params.channelId

  try {
    const channel = await req.app.locals.db.collection('channels').doc(channelId).get()
    const votes = channel.get('votes')

    const appid = req.body.appid
    const voteCount = req.body.votes
    const user = res.locals.userId

    if (votes[appid]) {
      if (votes[appid][user]) {
        // Add to existing vote count
        votes[appid][user] += voteCount
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

    await req.app.locals.db.collection('channels').doc(channelId).update({ votes })

    res.status(200).json(votes)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error
    })
  }
}