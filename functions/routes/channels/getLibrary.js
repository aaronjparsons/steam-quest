const getSteamLibrary = require('../../helpers/getSteamLibrary')

module.exports = async (req, res) => {
  const channelId = req.params.channelId

  try {
    const channel = await req.app.locals.db.collection('channels').doc(channelId).get()
    const steamLibrary = await getSteamLibrary(channel.data().steamId)

    const completed = []
    const library = steamLibrary.filter(item => {
      if (channel.data().ignored.includes(item.appid)) {
        return false
      }

      if (channel.data().previouslyCompleted.includes(item.appid)) {
        item.completed = 'Previously Completed'
        completed.push(item)
        return false
      }

      if (Object.keys(channel.data().completed).includes(item.appid)) {
        item.completed = channel.data().completed[item.appid]
        completed.push(item)
        return false
      }


      if (channel.data().votes[item.appid]) {
        item.totalVotes = Object.values(channel.data().votes[item.appid]).reduce((a, b) => {
          return a + b
        }, 0)
      } else {
        item.totalVotes = 0
      }
      return true
    })

    res.status(200).json({ library, completed })
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}