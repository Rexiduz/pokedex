const router = require('express').Router()
const isIncluded = require('../../utils').isIncluded
const paginate = require('../../utils').paginate

router.get('/:id/card', async (req, res) => {
  const accountID = req.params.id
  const { search, limit = 20, page } = req.query
  let result = []
  let userData = {}

  let UserCollection
  try {
    UserCollection = await req.DB.collection(`user.${accountID}`)
  } catch (e) {
    return res.json(
      req.Error.Server('US000CLN', { data: { cards: result }, error: e })
    )
  }

  if (!limit || !page) {
    return res.json(
      req.Error.BadRequest('US000QPR', {
        message: "['page','limit'] was required.",
        data: {
          cards: result
        }
      })
    )
  }

  userData = UserCollection.findAll() || {}

  if (search) {
    result = userData.cards?.filter((card) => {
      const validType = isIncluded(card.type, search)
      const validName = isIncluded(card.name, search)
      return validType || validName
    })
  } else result = userData.cards || []

  const [cut, hasNext] = paginate(limit, page)(result)
  return res.json({
    cards: cut,
    hasNext,
    page,
    total: result.length
  })
})

router.post('/:id/card', async (req, res) => {
  const payload = req.body?.data
  const accountID = req.params.id

  let UserCollection
  try {
    UserCollection = await req.DB.collection(`user.${accountID}`)
  } catch (e) {
    return res.json(req.Error.Server('US000CLN', { data: [], error: e }))
  }

  try {
    const previousData = UserCollection.findAll()
    const previousCardList = previousData['cards'] || []

    if (previousCardList.some((i) => i.id === payload.id))
      return res.json(
        req.Error.BadRequest('US001DID', {
          data: [],
          message: 'duplicate id ' + payload.id
        })
      )

    const values = {
      ...previousData,
      cards: [...previousCardList, payload]
    }

    const success = await UserCollection.update(values)

    if (!success) throw new Error('Update database failed')
    return res.json({ success, total: values?.cards.length })
  } catch (e) {
    return res.json(
      req.Error.BadRequest('US0001DBF', {
        data: [],
        message: 'create data failed',
        error: e
      })
    )
  }
})

router.delete('/:id/card/:cardID', async (req, res) => {
  const accountID = req.params.id
  const cardID = req.params.cardID

  let UserCollection
  try {
    UserCollection = await req.DB.collection(`user.${accountID}`)
  } catch (e) {
    return res.json(req.Error.Server('US000CLN', { data: [], error: e }))
  }

  try {
    const previousData = UserCollection.findAll()

    const success = await UserCollection.update({
      ...previousData,
      cards: [...(previousData['cards'] || [])].filter(
        (card) => card.id !== cardID
      )
    })

    if (!success) throw new Error('Update database failed')
    return res.json({ success })
  } catch (e) {
    return res.json(
      req.Error.BadRequest('US0001DBF', {
        data: [],
        message: 'create data failed',
        error: e
      })
    )
  }
})

module.exports = router
