const crypto = require('crypto')

const jwt = require('jsonwebtoken')

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
  const credential = Buffer.from(data, 'base64').toString('ascii').split(':')

  return {
    username: credential[0],
    password: credential[1],
  }
}

const setup = (server) => {
  server.post('/login', async (request, response) => {
    console.log(`executing: /login`)

    const credential = getCredential(request.headers.authorization.slice(6))
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

  server.post('/register', async (request, reply) => {
    console.log(`executing: /register`)

    const hashedPassword = hashPassword(request.body.password)

    console.log({
      name : request.body.name,
      email : request.body.email,
      password : hashedPassword
    })

    const response = {}

    reply.send({ response })
  })
}

module.exports = {
  setup,
}
