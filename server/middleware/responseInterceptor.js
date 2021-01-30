module.exports = (req, res, next) => {
  const json = res.json

  res.json = function (data) {
    const status = res.statusCode

    if (status === 200) {
      arguments[0] = {
        status,
        data
      }
    } else {
      arguments[0] = {
        status: data.status,
        code: data.code,
        message: data.message,
        meta: {
          data: data.data,
          stack: data.stack,
          isCustom: true
        }
      }
    }

    // console.log(`>>:: ${req.originalUrl} ::`, JSON.stringify(arguments[0]))
    json.apply(res, arguments)
  }

  next()
}
