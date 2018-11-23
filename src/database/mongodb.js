const MongoClient = require('mongodb').MongoClient;

const { database } = require('./../config')

const close = (client) => {
  client.close()
}

const connect = () => {
  return new Promise((resolve, reject) => {
    // Use connect method to connect to the server
    MongoClient.connect(database.url, { useNewUrlParser: true }, (error, client) => {
      if (error) {
        reject(error)

        return
      }

      console.log('Connected successfully to server')

      const db = client.db(database.name)

      resolve({ db, client })
    })
  })
}

/**
 * 
 * @param {object} db 
 * @param {string} collectionName 
 * @param {object} query 
 */
const findDocuments = (db, collectionName, query) => {
  return new Promise((resolve, reject) => {
    // Get the documents collection
    const collection = db.collection(collectionName)

    // Find some documents
    collection.find(query).toArray((error, docs) => {
      if (error) {
        reject(error)

        return
      }

      resolve(docs)
    })
  })
}

/**
 *
 * @param {object} db
 * @param {string} collectionName
 * @param {array} data
 */
const insertDocuments = (db, collectionName, data) => {
  return new Promise((resolve, reject) => {
    // Get the documents collection
    const collection = db.collection(collectionName)

    // Insert some documents
    collection.insertMany(data, (error, result) => {
      if (error) {
        reject(error)

        return
      }

      resolve(result)
    })
  })
}

/**
 * 
 * @param {object} db 
 * @param {string} collectionName 
 * @param {object} query 
 */
const removeDocument = (db, collectionName, query) => {
  return new Promise((resolve, reject) => {
    // Get the documents collection
    const collection = db.collection(collectionName)

    collection.deleteOne(query, (error, result) => {
      if (error) {
        reject(error)

        return
      }

      resolve(result)
    })
  })
}

/**
 * 
 * @param {object} db 
 * @param {string} collectionName 
 * @param {object} payload 
 */
const updateDocument = (db, collectionName, payload) => {
  // Get the documents collection
  const collection = db.collection(collectionName)

  collection.updateOne(payload.query, payload.values, (error, result) => {
    if (error) {
      reject(error)

      return
    }

    resolve(result)
  })
}

module.exports = {
  close,
  connect,
  findDocuments,
  insertDocuments,
  removeDocument,
  updateDocument,
}
