const crypto = require('crypto')

const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')

const config = require('./config')
const { mongodb } = require('./database')

/**
 *
 * @param {Object} error
 * @returns {Object}
 */
const generateError = (error) => {
  const id = uuidv4()
  const message = `An unexpected error has occurred [${error.message}]. Check the serer log for more information.`

  console.log(`Error Log: ID[${id}] - Message[${error.message}]`)

  return {
    type: 'error',
    id,
    name: error.name,
    message,
  }
}

const logSearch = async (id, type, query) => {
  try {
    const { db, client } = await mongodb.connect()
  
    const value = {
      history: {
        type,
        query,
        timestand: Date.now(),
      }
    }
  
    mongodb.updateDocument(
      db,
      'users',
      {'_id': new ObjectId(id)},
      { $push: value }
    )
  
    mongodb.close(client)
  } catch (error) {
    throw error
  }
}

const uuidv4 = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.randomBytes(16)[0] & 15 >> c / 4).toString(16)
  )
}

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.auth.secret, (error, decoded) => {
      if (error) {
        reject(error)

        return
      }

      resolve(decoded)
    })
  })
}

module.exports = {
  generateError,
  logSearch,
  uuid: uuidv4,
  verifyToken,
}
