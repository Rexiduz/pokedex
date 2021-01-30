const decode = require('jwt-decode')

module.exports = (req, res, next) => {
  try {
    const headers = JSON.parse(JSON.stringify(req.headers))
    const authcode = headers['authorization']
    req.user = decode(authcode.replace('Bearer ', ''))
  } catch {}

  next()
}
