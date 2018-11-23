const { ObjectId } = require('mongodb')

const { mongodb } = require('./../database')
const { generateError, verifyToken } = require('./../utils')

const setup = (server) => {
  server.get('/bookmarks', async (request, response) => {
    console.log(`executing: GET /bookmarks`)

    try {
      const token = await verifyToken(request.headers['x-access-token'])

      try {
        const { db, client } = await mongodb.connect()

        const result = await mongodb.findDocuments(
          db,
          'users',
          {'_id': new ObjectId(token.id)},
          { projection: { _id: 1, bookmarks: 1 } }
        )

        mongodb.close(client)

        response.send(result[0])
      } catch (error) {
        response.code(500).send(generateError(error))
      }
    } catch (error) {
      response.code(401).send(generateError(error))
    }
  })

  server.post('/bookmarks', async (request, response) => {
    console.log(`executing: POST /bookmarks`)

    try {
      const token = await verifyToken(request.headers['x-access-token'])

      try {
        const { db, client } = await mongodb.connect()

        const result = await mongodb.findDocuments(
          db,
          'users',
          {
            '_id': new ObjectId(token.id),
            'bookmarks': { ...request.body }
          },
        )

        if (result.length > 0) {
          response.code(400).send({ message: 'That bookmarks already exists.'})

          return
        }

        const value = {
          bookmarks: request.body
        }
      
        mongodb.updateDocument(
          db,
          'users',
          {'_id': new ObjectId(token.id)},
          { $push: value }
        )

        mongodb.close(client)

        const message = 'Bookmarks saved successfully'

        response.code(201).send({ message })
      } catch (error) {
        response.code(500).send(generateError(error))
      }
    } catch (error) {
      response.code(401).send(generateError(error))
    }
  })

  server.delete('/bookmarks/:id', async (request, response) => {
    console.log(`executing: DELETE /bookmarks/${request.params.id}`)

    try {
      const token = await verifyToken(request.headers['x-access-token'])

      try {
        const { db, client } = await mongodb.connect()

        const result = await mongodb.findDocuments(
          db,
          'users',
          {
            '_id': new ObjectId(token.id),
            'bookmarks': { ...request.body }
          },
        )

        if (result.length === 0) {
          response.code(400).send({ message: 'That bookmarks does not exist.'})

          return
        }

        await mongodb.updateDocument(
          db,
          'users',
           { '_id': new ObjectId(token.id) },
           { $pull: { bookmarks: { ...request.body } } }
        )

        mongodb.close(client)

        response.send({ message: 'Bookmarks deleted successfully'})
      } catch (error) {
        response.code(500).send(generateError(error))
      }
    } catch (error) {
      response.code(401).send(generateError(error))
    }
  })

  server.delete('/bookmarks', async (request, response) => {
    console.log(`executing:  DELETE /bookmarks`)

    try {
      const token = await verifyToken(request.headers['x-access-token'])

      try {
        const { db, client } = await mongodb.connect()
        
        await mongodb.updateDocument(
          db,
          'users',
           { '_id': new ObjectId(token.id) },
           { $unset: { bookmarks: 1 } }
        )

        mongodb.close(client)

        response.send({ message: 'All bookmarks deleted successfully'})
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
