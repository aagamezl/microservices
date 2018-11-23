const fs = require('fs')
const path = require('path')

const config = require('./../config')
const storePath = path.resolve(config.cache)

const getContent = (name, chapter = false) => {
  return new Promise((resolve, reject) => {
    // if the cache is valid, we read the file from cache
    fs.readFile(getPath(name, chapter), 'utf8', (error, data) => {
      if (error) {
        reject(error)
      }

      resolve(data)
    })
  })
}

const getPath = (name, chapter = false) => {
  const chapterPath = chapter === true ? 'chapter' : ''

  return path.join(storePath, chapterPath, `${name.replace(/ /g, '-')}.html`)
}

/**
 *
 * @param {string} name
 * @param {boolean} chapter
 */
const isValid = (name, chapter = false) => {
  return new Promise((resolve, reject) => {
    fs.stat(getPath(name, chapter), (error, stats) => {
      if (error) {
        resolve(false)

        return
      }

      // CHeck if the file was created less than 24 hours ago
      resolve(stats.ctimeMs - (3600 * 24 * 1000) < Date.now())
    })
  })
}

const writeContent = (name, content, chapter = false) => {
  const cachePath = getPath(name, chapter)

  return new Promise((resolve, reject) => {
    fs.mkdir(path.dirname(cachePath), { recursive: true }, (error) => {
      if (error) {
        reject(error)
      }
      
      fs.writeFile(cachePath, content, (error) => {
        if (error) {
          reject(error)
  
          return
        }
  
        resolve(content)
      })
    })
  })
}

module.exports = {
  getContent,
  isValid,
  writeContent,
}
