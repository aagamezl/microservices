const consul = require('consul')()

const heartbeat = (details, delay = 5 * 1000) => {
  return new Promise((resolve, reject) => {
    setInterval(() => {
      consul.agent.check.pass(details, (error) => {
        if (error) {
          reject(error)
  
          return
        }

        console.log('told Consul that we are healthy')

        resolve(true)
      });
    }, delay);
  })
}

module.exports = {
  heartbeat
}
