module.exports = async (req, res) => {
  try {
    const channel = await req.app.locals.db.collection('channels').doc(req.body.id).set({
      ...req.body
    })
    res.status(201).send()
  } catch (error) {
    res.status(500).send(error)
  }
}