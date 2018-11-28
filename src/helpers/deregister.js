const consul = require('consul')()

const deregister = (details) => {
  return new Promise((resolve, reject) => {
    consul.agent.service.deregister(details, (error) => {
      if (error) {
        reject(error)

        return
      }

      resolve(true)
    })
  })
}

module.exports = {
  deregister
}
