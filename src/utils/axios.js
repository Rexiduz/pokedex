import Axios from 'axios'
import ENV from 'constants/env'
import { TOKEN } from 'constants/setting'

const headers = {
  baseURL: ENV.BASE_URL
}

const axios = Axios.create(headers)

const customizeError = ({ response, ...configs } = {}) => {
  return Promise.reject(response?.data)
}
const customizeResponse = (axRes) => Promise.resolve(axRes?.data)
const customizeRequest = (axReq) => {
  axReq.headers['Web-Pathname'] = window.location.pathname
  axReq.headers['Authorization'] = `Bearer ${TOKEN}`

  return axReq
}

axios.interceptors.request.use(customizeRequest, customizeError)
axios.interceptors.response.use(customizeResponse, customizeError)

export default axios
