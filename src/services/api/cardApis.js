import { ApiProvider } from './shared'

export default (() => ({
  get({ id, ...params } = {}) {
    return ApiProvider.cards('get', id)(params)
  }
}))()
