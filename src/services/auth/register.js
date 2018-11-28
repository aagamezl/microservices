const { json, send, text } = require('micro')
const jwt = require('jsonwebtoken')

const { mongodb } = require('./../../database')
const config = require('./../../config')
const { uuid } = require('../../utils')
const { register } = require('./../../helpers')
const { hashPassword, generateToken, getCredential } = require('./common')
const { generateError } = require('./../../utils')

const name = 'register'
const port = 3002
const address = `http://127.0.0.1:${port}/register`

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
  let body
  try {
    body = await json(request)
  } catch (error) {
    console.log(error)
  }
  const hashedPassword = hashPassword(body.password)

  const user = {
    name: body.name,
    username: body.username,
    password: hashedPassword
  }

  try {
    const { db, client } = await mongodb.connect()

    const found = await mongodb.findDocuments(db, 'users', {
      username: user.username,
      password: hashedPassword
    })

    if (found.length > 0) {
      send(response, 200, {
        message: 'This user already exists'
      })

      return
    }

    // TODO: Check if the user exists
    const result = await mongodb.insertDocuments(db, 'users', [user])

    mongodb.close(client)

    const token = generateToken({
      id: result.insertedIds[0].toString()
    }, config.auth.secret, '1d')

    // retrieve issue and expiration times
    const { iat, exp } = jwt.decode(token)

    send(response, 200, { iat, exp, token })
  } catch (error) {
    send(response, 500, generateError(error))
  }
}