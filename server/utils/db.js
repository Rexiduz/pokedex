const fs = require('fs')
const isIncluded = require('./index').isIncluded
const getter = require('./index').getter

const createCollection = (data, filepath) => {
  const guard = (func) => (...args) => {
    if (args.every((i) => !i)) return data

    if (typeof args[0] === 'function') {
      return data.filter(args[0])
    }

    return func(...args)
  }

  return {
    find: guard((key, value) => {
      return data.find((item) => isIncluded(getter(item, key), value))
    }),
    findAll: guard((key, value) => {
      return data.filter((item) => isIncluded(getter(item, key), value))
    }),
    get: guard((key, value) => {
      return data.find((item) => getter(item, key) === value)
    }),
    getAll: guard((key, value) => {
      return data.filter((item) => getter(item, key) === value)
    }),
    async update(data) {
      return new Promise((resolve) => {
        try {
          fs.writeFileSync(filepath, JSON.stringify(data))
          resolve(true)
        } catch (error) {
          throw error
        }
      })
    }
  }
}

const createJsonDB = (FILEPATH_ROOT) => {
  const CONFIGS_FILE = {}

  return {
    checkFile(filename, defaultValue = '') {
      const filepath = __dirname + '/' + FILEPATH_ROOT + filename

      CONFIGS_FILE[filename] = {
        filepath,
        defaultValue
      }

      try {
        require(filepath)
      } catch (e) {
        try {
          fs.writeFileSync(filepath, defaultValue)
        } catch (error) {
          throw error
        }
      } finally {
        return this
      }
    },
    init() {
      return this
    },
    async collection(name) {
      const config = CONFIGS_FILE[name + '.json']
      const data = fs.readFileSync(config.filepath, {
        encoding: 'utf8',
        flag: 'r'
      })

      try {
        return createCollection(JSON.parse(data), config.filepath)
      } catch (e) {
        throw e
      }
    }
  }
}

module.exports = createJsonDB('../assets/file/')
  .checkFile('user.520a4eb3-c11d-44eb-a9f8-41a79e0dc73a.json', '{}')
  .checkFile(
    'card.json',
    JSON.stringify(require(__dirname + '/../../src/assets/file/card.json'))
  )
  .init()
