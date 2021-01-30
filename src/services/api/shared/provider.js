import axios from 'utils/axios'

const createAxiosRequest = (domain = '') => (method = '', path = '') => (
  body,
  options = {}
) => {
  const httpMethod = method.toLowerCase()
  const request = axios[httpMethod]
  const url = '/' + domain + '/' + path
  const opt = {
    ...options,
    ...(httpMethod === 'get'
      ? { params: body }
      : {
          data: body
        })
  }

  return request(url, opt)
}

export default (() => ({
  cards: createAxiosRequest('card'),
  users: createAxiosRequest('user')
}))()
