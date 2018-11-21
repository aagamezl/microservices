// Require the framework and instantiate it
const fastify = require('fastify')
const server = fastify({
  logger: false
})

const { auth, chapter, search } = require('./routes')

// Declare a route
server.get('/', (request, reply) => {
  reply.send({ hello: 'world' })
})

auth.setup(server)
chapter.setup(server)
search.setup(server)

// Run the server!
server.listen(3000, '127.0.0.1')
  .then((address) => console.log(`server listening on ${address}`))
  .catch(err => {
    console.log('Error starting server:', err)
    process.exit(1)
  })
