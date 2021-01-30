import { ApiProvider } from './shared'

export default (() => ({
  get({ id, ...params } = {}) {
    return ApiProvider.users('get', id)(params)
  },
  update({ id, ...data } = {}) {
    return ApiProvider.users('update', id)(data)
  }
}))()
