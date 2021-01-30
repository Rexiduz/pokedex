const customError = (res) => {
  return {
    create({ status, code, message, error, data }) {
      const err = error || new Error(message || 'process failed')
      err.status = status
      err.data = data
      err.code = code
      res.status(status)
      return err
    },
    BadRequest(code, { message = 'bad request', error, ...data }) {
      return this.create({ status: 400, code, message, error, data })
    },
    NotFound(code, { message = 'not found', error, ...data }) {
      return this.create({ status: 404, code, message, error, data })
    },
    Server(code, { message = 'internal server error', error, ...data }) {
      return this.create({ status: 500, code, message, error, data })
    }
  }
}

module.exports = (req, res, next) => {
  req.Error = customError(res)
  next()
}
