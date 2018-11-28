const crypto = require('crypto')

const jwt = require('jsonwebtoken')

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

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

module.exports = {
  generateToken,
  getCredential,
  hashPassword,
}