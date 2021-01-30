const router = require('express').Router()
const isIncluded = require('../../utils').isIncluded
const isEmpty = require('lodash').isEmpty

router.get('/:id*?', (req, res) => {
  const accountID = req.user?.userID ?? req.params.id
  const { name, type, limit = 20 } = req.query

  let UserCollection
  try {
    UserCollection = req.DB.collection(`user.${accountID}`)
  } catch (e) {
    return res.json(req.Error.Server('US000CLN', { data: [], error: e }))
  }

  if (isEmpty(req.query)) {
    return res.json(
      req.Error.BadRequest('US001QPR', {
        message: "one of params ['name','type','limit'] was required.",
        data: []
      })
    )
  }

  // Not support pagination
  if (name && type) {
    return res.json(
      UserCollection.findAll((card) => {
        const validType = isIncluded(req?.query?.type, card.type)
        const validName = isIncluded(req?.query?.name, card.name)

        return validType && validName
      })
    )
  } else if (name) return res.json(UserCollection.findAll('name', name))
  else if (type) return res.json(UserCollection.findAll('type', type))
  else return res.json(UserCollection.findAll().slice(0, limit))
})

module.exports = router
