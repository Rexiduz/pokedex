const router = require('express').Router()
const controller = require('./app')

router.use('/card', controller.card)
router.use('/user', controller.user)

module.exports = router
