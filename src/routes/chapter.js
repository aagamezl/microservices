const { getChapter } = require('../scrappers/mangapark/chapter')

const { generateError, logSearch, verifyToken } = require('./../utils')

const setup = (server) => {
  server.get('/chapter/:name', async (request, response) => {
    console.log(`executing: GET /chapter/${request.params.name}`)

    try {
      const token = await verifyToken(request.headers['x-access-token'])

      try {
        await logSearch(token.id, 'chapter', request.params.name)

        const result = await getChapter(request.params.name)

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
  setup
}
