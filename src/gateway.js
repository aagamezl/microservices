// const fastify = require('fastify')
// const server = fastify({
//   logger: false
// })

// const axios = require('axios')

// // const cors = require('cors')
// // const helmet = require('helmet')

// const { discover } = require('./helpers')
// // const { fetch } = require('./utils')

// let knownInstances = []

// const checkServices = async () => {
//   try {
//     knownInstances = await discover()

//     console.log(`There are ${Object.keys(knownInstances).length} active services`)
//   } catch (error) {
//     console.log(error)
//   }
// }

// checkServices()

// setInterval(checkServices, 10 * 1000)

// // server.use(cors())
// // server.use(helmet())

// server.route({
//   method: ['GET', 'POST'],
//   url: '*',
//   handler: async (request, response) => {

//     for (let [id, instance] of Object.entries(knownInstances)) {
//       if (instance.Service === request.raw.originalUrl.slice(1)) {
//         // let payload
        
//         // try {
//         //   payload = await json(request)
//         // } catch (error) {
//         //   payload = undefined
//         // }

//         // const options = {
//         //   method: request.method,
//         //   headers: request.headers,
//         //   json: payload
//         // }

//         try {
//           const result = await axios({
//             method: request.raw.method,
//             url: instance.Address,
//             headers: request.headers,
//             data: request.body,
//           })
//           response.send(result.data)
//         } catch (error) {
//           response.code(500).send(error)
//         }
//       }
//     }

//     // try {
//       // const result = await fetch('http://localhost:3002/register', options)

//       axios({
//         method: request.raw.method,
//         url: 'http://localhost:3002/register',
//         headers: {
//           authorization: request.headers.authorization
//         },
//         data: request.body,
//       }).then((result) => {
//         response.send(result.data)
//       })
//       .catch((error) => {
//         response.code(500).send(error)

//         return
//       })
//     // } catch (error) {
//     //   response.code(500).send(error)
//     // }
//   }
// })

// // Run the server!
// server.listen(3000, '127.0.0.1')
//   .then((address) => console.log(`server listening on ${address}`))
//   .catch(err => {
//     console.log('Error starting server:', err)
//     process.exit(1)
//   })

const { json, send, text } = require('micro')
const axios = require('axios')

const { discover } = require('./helpers')
// const { fetch } = require('./utils')

let knownInstances = []

const checkServices = async () => {
  try {
    knownInstances = await discover()

    // console.log(JSON.stringify(knownInstances, null, '  '))
    console.log(`There are ${Object.keys(knownInstances).length} active services`)
  } catch (error) {
    console.log(error)
  }
}

checkServices()

setInterval(checkServices, 10 * 1000)

process.on('SIGINT', async () => {
  console.log('SIGINT. stopping gateway...')

  process.exit();
})

module.exports = async (request, response) => {
  for (let [id, instance] of Object.entries(knownInstances)) {
    if (instance.Service === request.url.slice(1)) {
      let payload
      
      try {
        payload = await json(request)
      } catch (error) {
        payload = undefined
      }

      try {
        // const result = await fetch(instance.Address, options)
        const result = await axios({
          method: request.method,
          url: instance.Address,
          headers: request.headers,
          data: payload,
        })

        send(response, 200, result.data)

        return
      } catch (error) {
        send(response, 500, error)

        return
      }
    }
  }

  send(response, 404, {message: 'Service not available'})
}