const crypto = require('crypto')
const ObjectId = require('mongodb').ObjectID

const jwt = require('jsonwebtoken')

const { uuid } = require('./../utils')
const { mongodb } = require('./../database')
const config = require('./../config')

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
    console.log(`executing: /login`)

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
        response.code(500).send({
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
 

    // console.log(data)

    // const token = generateToken({ id: 'user._id' }, credential.password)

    // // retrieve issue and expiration times
    // const { iat, exp } = jwt.decode(token)

    // response.send({ iat, exp, token })
  })

  server.post('/register', async (request, response) => {
    console.log(`executing: /register`)

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

const generateError = (error) => {
  // const id = crypto.randomBytes(16).toString('hex')
  const id = uuid()
  const message = `An unexpected error has occurred [${error.message}]. Check the serer log for more information.`

  console.log(`Error Log: ID[${id}] - Message[${error.message}]`)

  return {
    type: 'error',
    id,
    name: error.name,
    message,
  }
}

module.exports = {
  setup,
}
