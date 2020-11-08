module.exports =  async (req, res) => {
  const channelId = req.params.channelId

  try {
    const user = res.locals.userId
    res.status(200).json({ user })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error
    })
  }
}