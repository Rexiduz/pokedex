module.exports = (req, res, next) => {
  req.DB = require('../utils/db')

  next()
}
