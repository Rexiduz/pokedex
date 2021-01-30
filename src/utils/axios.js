import Axios from 'axios'
import { message } from 'antd'
import reduce from 'lodash/reduce'
import ENV from 'constants/env'
import { TOKEN } from 'constants/setting'

const headers = {
  baseURL: ENV.BASE_URL
}

const axios = Axios.create(headers)

const cleanParams = (params) => {
  return reduce(
    params,
    (acc, curr, key) => ({
      ...acc,
      ...(!['', undefined, null].includes(curr) && {
        [key]: curr
      })
    }),
    {}
  )
}

const customizeError = ({ response, ...configs } = {}) => {
  const data = response?.data
  message.error(data.message || data.code)
  return Promise.reject(data)
}

const customizeResponse = (axRes) => Promise.resolve(axRes?.data)
const customizeRequest = (axReq) => {
  axReq.headers['Web-Pathname'] = window.location.pathname
  axReq.headers['Authorization'] = `Bearer ${TOKEN}`

  axReq.params = cleanParams(axReq.params)

  return axReq
}

axios.interceptors.request.use(customizeRequest, customizeError)
axios.interceptors.response.use(customizeResponse, customizeError)

export default axios
