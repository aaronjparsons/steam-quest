const getSteamLibrary = require('../../helpers/getSteamLibrary')


module.exports = async (req, res) => {
  try {
    const steamId = req.body.steamId

    const steamLibrary = await getSteamLibrary(steamId)
    // TODO: Invalid Steam ID??
    const library = steamLibrary.reduce((acc, game) => {
      acc[game.appid] = {
        appid: game.appid,
        name: game.name,
        img_logo_url: game.img_logo_url,
        completed: null,
        ignored: false,
        previouslyCompleted: false
      }
      return acc
    }, {})
    const data = {
      ...req.body,
      votes: {},
      library
    }

    const channel = await req.app.locals.db.collection('channels').doc(req.body.id).set(data)
    res.status(201).json(data)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}