const request = require('request')

const getList = (nodeList) => {
  return Array.from(nodeList.map((index, element) => element.text))
}

const makeRequest = async (url) => {
  return new Promise((resolve, reject) => {
    request(url, async (error, response, html) => {
      if (error) {
        reject(error)

        return
      }

      if (response.statusCode === 200) {
        resolve(html)
      }
    })
  })
}

module.exports = {
  getList,
  makeRequest,
}
