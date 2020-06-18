const functions = require('firebase-functions')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const key = Buffer.from(functions.config().steamquest.twitchkey, 'base64')
    const decodedToken = jwt.verify(token, key, { algorithms: ['HS256'] })
    const userId = decodedToken.user_id

    // Store the verified user ID for future use
    res.locals.userId = userId

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