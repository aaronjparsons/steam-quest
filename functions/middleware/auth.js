const functions = require('firebase-functions')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const key = Buffer.from(functions.config().steamquest.twitchkey, 'base64')
    const decodedToken = jwt.verify(token, key, { algorithms: ['HS256'] })
    console.log(decodedToken)
    const userId = decodedToken.user_id

    // Store some data for future use
    res.locals.userId = userId
    res.locals.channelId = decodedToken.channel_id

    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID'
    } else {
      next()
    }
  } catch (error) {
    res.status(401).json({
      error: 'Unauthenticated'
    })
  }
}