const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const { auth } = require('./../config')

// const { getChapter } = require('./mangapark/chapter')
const { searchByTitle } = require('./mangapark/search')

async function init () {
  // try {
  //   // const response = await getChapter('fairy-tail')
  //   const response = await searchByTitle('fairy tail')
  
  //   console.log(JSON.stringify(response, null, ' '))
  // } catch (error) {
  //   console.log(error)
  // }

  // create a token
  const token = jwt.sign(
    { id: 'user._id' },
    auth.secret,
    { expiresIn: 3600 * 24 } // expires in 24 hours
  )

  console.log(token)

  jwt.verify(token, config.secret, function(error, decoded) {
    if (error) {
      throw error
    }
    
    console.log(decoded)
  })
}

init()
