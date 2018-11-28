const url = require('url')

const { send } = require('micro')
const jwt = require('jsonwebtoken')

const { mongodb } = require('./../../database')
const config = require('./../../config')
const { uuid } = require('../../utils')
const { register } = require('./../../helpers')
const { hashPassword, generateToken, getCredential } = require('./common')
const { generateError } = require('./../../utils')

const name = 'login'
const port = 3001
const address = `http://127.0.0.1:${port}/login`

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
  const credential = getCredential(request.headers.authorization)
  const hashedPassword = hashPassword(credential.password)

  const user = {
    username : credential.username,
    password : hashedPassword
  }

  try {
    const { db, client } = await mongodb.connect()

    const found = await mongodb.findDocuments(db, 'users', user)

    mongodb.close(client)

    if (found.length === 0) {
      response.code(404).send({
        message: `This user don't exists`
      })

      return
    }

    const token = generateToken({
      id: found[0]._id.toString()
    }, config.auth.secret, '1d')

    // retrieve issue and expiration times
    const { iat, exp } = jwt.decode(token)

    send(response, 200, { iat, exp, token })
  } catch (error) {
    send(response, 500, generateError(error))
  }
}