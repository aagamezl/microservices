const crypto = require('crypto')

const { fetchUrl } = require('fetch')
const request = require('request')
const axios = require('axios')

const uuidv4 = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.randomBytes(16)[0] & 15 >> c / 4).toString(16)
  )
}

const fetch = async (url, options) => {
  axios.post(options)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
/*   return new Promise((resolve, reject) => {
    // fetchUrl(url, options, (error, meta, body) => {
    //   if (error) {
    //     reject(error)
  
    //     return
    //   }
  
    //   resolve(JSON.parse(body.toString()))
    // })

    request({ url, ...options }, (error, response, data) => {
      if (error) {
        reject(error)

        return
      }

      if (response.statusCode === 200) {
        resolve(JSON.parse(data))
      }
    })
  }) */
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
  fetch,
  generateError,
  uuid: uuidv4,
}