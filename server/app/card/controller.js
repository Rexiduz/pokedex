const router = require('express').Router()
const isIncluded = require('../../utils').isIncluded
const paginate = require('../../utils').paginate
const isEmpty = require('lodash').isEmpty

router.get('/', (req, res) => {
  const { name, type, limit = 20, page } = req.query
  let CardCollection
  let result

  try {
    CardCollection = req.DB.collection('card')
  } catch (e) {
    return res.json(req.Error.Server('CD000CLN', { data: [], error: e }))
  }

  if (!limit || !page) {
    return res.json(
      req.Error.BadRequest('CD000QPR', {
        message: "['page','limit'] was required.",
        data: { cards: [] }
      })
    )
  }

  if (isEmpty(req.query)) {
    return res.json(
      req.Error.BadRequest('CD001QPR', {
        message: "one of params ['name','type', 'page', 'limit'] was required.",
        data: { cards: [] }
      })
    )
  }

  // Not support pagination
  if (name && type) {
    result = CardCollection.findAll((card) => {
      const validType = isIncluded(req?.query?.type, card.type)
      const validName = isIncluded(req?.query?.name, card.name)

      return validType && validName
    })
  } else if (name) result = CardCollection.findAll('name', name)
  else if (type) result = CardCollection.findAll('type', type)
  else result = CardCollection.findAll()

  const [cut, hasNext] = paginate(limit, page)(result)
  return res.json({
    cards: cut,
    hasNext,
    page,
    total: result.length
  })
})

module.exports = router
