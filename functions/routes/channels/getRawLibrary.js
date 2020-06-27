const getSteamLibrary = require('../../helpers/getSteamLibrary')

module.exports = async (req, res) => {
  const channelId = req.params.channelId

  try {
    const channel = await req.app.locals.db.collection('channels').doc(channelId).get()
    const library = await getSteamLibrary(channel.data().steamId)
    res.status(200).json(library)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}