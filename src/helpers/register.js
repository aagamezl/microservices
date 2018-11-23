const consul = require('consul')()

const { heartbeat } = require('./heartbeat')
const { deregister } = require('./deregister')

const register = (details) => {
  return new Promise((resolve, reject) => {
    consul.agent.service.register(details, async (error) => {
      if (error) {
        reject(error)

        return
      }

      try {
        // schedule heartbeat
        await heartbeat(
          {id: `service:${details.id}`}
        )

        process.on('SIGINT', async () => {
          console.log('SIGINT. De-Registering...')

          try {
            await deregister({ id: details.id })

            process.exit();
          } catch (error) {
            reject(error)
          }
        })
      } catch (error) {
        reject(error)
      }

      resolve(true)
    })
  })
}

module.exports = {
  register
}
