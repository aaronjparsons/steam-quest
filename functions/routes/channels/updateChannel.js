module.exports =  async (req, res) => {
  const channelId = req.params.channelId

  try {
    const channel = await req.app.locals.db.collection('channels').doc(channelId).update(req.body)
    res.status(200).send()
  } catch (error) {
    res.status(500).json({
      error
    })
  }
}