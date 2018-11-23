const crypto = require('crypto')

const uuidv4 = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.randomBytes(16)[0] & 15 >> c / 4).toString(16)
  )
}

/**
 *
 * @param {Object} error
 * @returns {Object}
 */
const generateError = (error) => {
  const id = uuidv4()
  const message = `An unexpected error has occurred [${error.message}]. Check the server log for more information.`

  console.log(`Error Log: ID[${id}] - Message[${error.message}]`)

  return {
    type: 'error',
    id,
    name: error.name,
    message,
  }
}

module.exports = {
  generateError,
  uuid: uuidv4,
}