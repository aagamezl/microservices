const crypto = require('crypto')

const jwt = require('jsonwebtoken')

const { mongodb } = require('./../database')
const config = require('./../config')

const { generateError } = require('./../utils')

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

const generateToken = (payload, password, expireIn = '15m') => {
  return jwt.sign(
    payload,
    password,
    { expiresIn: expireIn }
  )
}

const getCredential = (data) => {
  const credential = Buffer.from(data.slice(6), 'base64')
    .toString('ascii').split(':')

  return {
    username: credential[0],
    password: credential[1],
  }
}

const setup = (server) => {
  server.post('/login', async (request, response) => {
    console.log(`executing: POST /login`)

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

      response.send({ iat, exp, token })
    } catch (error) {
      response.code(500).send(generateError(error))
    }
  })

  server.post('/register', async (request, response) => {
    console.log(`executing: POST /register`)

    const credential = getCredential(request.headers.authorization)
    const hashedPassword = hashPassword(credential.password)

    const user = {
      name: request.body.name,
      username: credential.username,
      password: hashedPassword
    }

    try {
      const { db, client } = await mongodb.connect()

      const found = await mongodb.findDocuments(db, 'users', {
        username: credential.username,
        password: hashedPassword
      })

      if (found.length > 0) {
        response.code(500).send({
          message: 'This user already exists'
        })

        return
      }

      // TODO: Check if the user exists
      const result = await mongodb.insertDocuments(db, 'users', [user])

      mongodb.close(client)

      console.log(result)

      const token = generateToken({
        id: result.insertedIds[0].toString()
      }, config.auth.secret, '1d')

      // retrieve issue and expiration times
      const { iat, exp } = jwt.decode(token)

      response.send({ iat, exp, token })
    } catch (error) {
      response.code(500).send(generateError(error))
    }
  })
}

module.exports = {
  setup,
}
