const { send } = require('micro')
const url = require('url')

const { uuid } = require('../../utils')
const { register } = require('./../../helpers')

const name = 'register'
const address = 'https://127.0.0.1/register'
const port = 3002

const visits = {};

async function init () {
  try {
    const details = {
      name,
      address,
      port,
      id: uuid(),
      check: {
        ttl: '10s',
        deregister_critical_service_after: '1m'
      }
    }
  
    const result = await register(details)
  
    console.log(`Service registered: ${result}`)
  } catch (error) {
    console.log(error)
  }
}

init()

module.exports = async (request, response) => {
  const { pathname } = url.parse(request.url)

  if (visits[pathname]) {
    visits[pathname] = visits[pathname] + 1
  } else {
    visits[pathname] = 1
  }

  send(response, 200, `This page has ${visits[pathname]} visits!`)
}