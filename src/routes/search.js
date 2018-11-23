// const { ObjectId } = require('mongodb')

const { generateError, logSearch, verifyToken } = require('./../utils')

const {
  searchByAuthor,
  searchByTitle
} = require('./../scrappers/mangapark/search')

// const { mongodb } = require('./../database')

// const logSearch = async (id, type, query) => {
//   try {
//     const { db, client } = await mongodb.connect()
  
//     const value = {
//       history: {
//         type,
//         query,
//         timestand: Date.now(),
//       }
//     }
  
//     mongodb.updateDocument(db, 'users', {
//       query: {'_id': new ObjectId(id)},
//       values: { $push: value }
//     })
  
//     mongodb.close(client)
//   } catch (error) {
//     throw error
//   }
// }

const setup = (server) => {
  server.get('/search/author/:query', async (request, response) => {
    console.log(`executing: /search/author/${request.params.query}`)

    try {
      const token = await verifyToken(request.headers['x-access-token'])

      try {
        await logSearch(token.id, 'author', request.params.query)

        const result = await searchByAuthor(request.params.query)

        response.send({ result })
      } catch (error) {
        response.code(500).send(generateError(error))
      }
    } catch (error) {
      response.code(401).send(generateError(error))
    }
  })

  server.get('/search/title/:query', async (request, response) => {
    console.log(`executing: /search/title/${request.params.query}`)

    try {
      const token = await verifyToken(request.headers['x-access-token'])

      try {
        await logSearch(token.id, 'title', request.params.query)

        const result = await searchByTitle(request.params.query)

        response.send({ result })
      } catch (error) {
        response.code(500).send(generateError(error))
      }
    } catch (error) {
      response.code(401).send(generateError(error))
    }
  })
}

module.exports = {
  setup,
}
