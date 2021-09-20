module.exports =  async (req, res) => {
  const channelId = req.params.channelId

  try {
    await req.app.locals.db.collection('channels').doc(channelId).update(req.body)
    const channel = await req.app.locals.db.collection('channels').doc(channelId).get()

    res.status(200).json(channel.data())
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}