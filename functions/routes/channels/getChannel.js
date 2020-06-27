module.exports = async (req, res) => {
  const channelId = req.params.channelId

  try {
    // Only the owner of the channel may access this route
    if (!res.locals.userId || res.locals.userId !== channelId) {
      res.status(401).json({
        error: 'Not Authorized'
      })
    }

    const channel = await req.app.locals.db.collection('channels').doc(channelId).get()

    if (channel.exists) {
      res.status(200).json({
        id: channel.id,
        ...channel.data()
      })
    } else {
      res.status(200).json({})
    }
  } catch (error) {
    res.status(500).send(error)
  }
}