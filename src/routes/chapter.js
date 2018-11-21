const { getChapter } = require('../scrappers/mangapark/chapter')

const setup = (server) => {
  server.get('/chapter/:name', async (request, reply) => {
    console.log(`executing: /chapter/${request.params.name}`)
    
    const response = await getChapter(request.params.name)

    reply.send({ response })
  })
}

module.exports = {
  setup
}
