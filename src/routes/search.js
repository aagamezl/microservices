const {
  searchByAuthor,
  searchByTitle
} = require('./../scrappers/mangapark/search')

const setup = (server) => {
  server.get('/search/author/:query', async (request, reply) => {
    console.log(`executing: /search/author/${request.params.query}`)

    const response = await searchByAuthor(request.params.query)

    reply.send({ response })
  })

  server.get('/search/title/:query', async (request, reply) => {
    console.log(`executing: /search/title/${request.params.query}`)

    const response = await searchByTitle(request.params.query)

    reply.send({ response })
  })
}

module.exports = {
  setup,
}
