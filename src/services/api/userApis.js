import { ApiProvider } from './shared'

export default (() => ({
  get({ id, ...params } = {}) {
    return ApiProvider.users(
      'get',
      id
    )({
      params
    })
  }
}))()
