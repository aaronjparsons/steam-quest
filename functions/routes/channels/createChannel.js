module.exports = async (req, res) => {
  try {
    const channel = await req.app.locals.db.collection('channels').doc(req.body.id).set({
      steamId: req.body.steamId,
      ignored: req.body.ignored,
      previouslyCompleted: req.body.previouslyCompleted,
      completed: req.body.completed
    })
    res.status(201).send()
  } catch (error) {
    res.status(500).send(error)
  }
}