import { ApiProvider } from './shared'

const cardApis = () => ({
  get({ id, ...params } = {}) {
    return ApiProvider.users('get', `${id}/card`)(params)
  },
  update({ id, data } = {}) {
    return ApiProvider.users('post', `${id}/card`)(data)
  },
  delete({ id, cardID } = {}) {
    return ApiProvider.users('delete', `${id}/card/${cardID}`)()
  }
})

export default (() => ({
  cards: cardApis()
}))()
