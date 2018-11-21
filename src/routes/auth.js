const crypto = require('crypto')

const jwt = require('jsonwebtoken')

const { uuid } = require('./../utils')
const mongodb = require('./../database/mongodb')

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

const generateToken = (payload, password, expireIn = '15m') => {
  return jwt.sign(
    payload,
    password,
    { expiresIn: expireIn } // expires in 24 hours
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

    // const data = {
    //   username : credential.username,
    //   password : hashedPassword
    // }

    // console.log(data)

    const token = generateToken({ id: 'user._id' }, credential.password)

    // retrieve issue and expiration times
    const { iat, exp } = jwt.decode(token)

    response.send({ iat, exp, token })
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

      // TODO: Check if the user exists
      const result = await mongodb.insertDocuments(db, 'users', [user])

      mongodb.close(client)

      console.log(result)

      const token = generateToken({
        id: result.insertedIds[0].toString()
      }, credential.password)

      // retrieve issue and expiration times
      const { iat, exp } = jwt.decode(token)

      response.send({ iat, exp, token })
    } catch (error) {
      // const id = crypto.randomBytes(16).toString('hex')
      const id = uuid()
      const message = `An unexpected error has occurred. Check the serer log for more information. Error ID: ${id}`

      response.code(500).send({ message })
      
      console.log(`Error ID: ${id} - ${error.message}`)
    }
  })
}

module.exports = {
  setup,
}
