const fs = require('fs')
const isIncluded = require('./index').isIncluded
const getter = require('./index').getter

const createCollection = (data, filepath) => {
  const guard = (func) => (...args) => {
    if (args.every((i) => !i)) return data

    if (typeof args?.[0] === 'function') {
      return data.filter(args?.[0])
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
          console.log('Update file error', error)
          resolve(false)
        }
      })
    }
  }
}

const createJsonDB = (FILEPATH_ROOT) => {
  const INNER__COLLECTION = {}
  const FILE_PATHS = {}

  return {
    checkFile(filename, defaultValue = '') {
      const filepath = __dirname + '/' + FILEPATH_ROOT + filename
      FILE_PATHS[filename] = {
        path: filepath.replace(/(\/..\/)/, '/'),
        defaultValue
      }

      try {
        require(filepath)
      } catch (e) {
        try {
          fs.writeFileSync(filepath, defaultValue)
        } catch (error) {
          console.log('ERROR: create file', error)
        }
      } finally {
        return this
      }
    },
    initializeCollection(colName) {
      const fileCollectionName = colName + '.json'

      INNER__COLLECTION[colName] = createCollection(
        require(FILEPATH_ROOT + fileCollectionName),
        FILE_PATHS[fileCollectionName].path
      )
    },
    init() {
      Object.keys(FILE_PATHS).forEach((collectionName) => {
        this.initializeCollection(collectionName.replace('.json', ''))
      })

      return this
    },
    collection(name) {
      const instance = INNER__COLLECTION[name]
      if (!instance) throw new Error('Collection ' + name + ' not-found.')

      return instance
    }
  }
}

const JsonDB = createJsonDB('../assets/file/')

JsonDB.checkFile('user.520a4eb3-c11d-44eb-a9f8-41a79e0dc73a.json', '[]')
  .checkFile(
    'card.json',
    JSON.stringify(require(__dirname + '/../../src/assets/file/card.json'))
  )
  .init()

module.exports = JsonDB
