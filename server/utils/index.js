const _ = require('lodash')

const isIncluded = (text = '', find = '') =>
  text.toLowerCase().includes(find.toLowerCase())

const getter = (data, key, ...args) => _.get(data, key.split('.'), ...args)

const paginate = (limit, page) => (list) => {
  const startIndex = Number(limit) * (Number(page) - 1)
  const endIndex = startIndex + Number(limit) // slice index more than target index 1 index

  const hasNext = endIndex + 1 <= list.length
  return [list.slice(startIndex, endIndex), hasNext]
}

module.exports = {
  isIncluded,
  getter,
  paginate
}
