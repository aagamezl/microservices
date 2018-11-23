const jQuery = require('jquery')
const jsdom = require('jsdom')

const { JSDOM } = jsdom

const { getContent, isValid, writeContent } = require('../../cache')
const { getList, makeRequest } = require('./common')
const url = require('./config')

const getInfoByAuthor = (html) => {
  const { window } = new JSDOM(html)
  const $ = jQuery(window);

  const response = []

  $('.manga-list .item').each((index, element) => {
    const fields = $('.info .field', element)
    let fieldIndex

    if (fields.length < 3) {
      fieldIndex = 0
    } else {
      fieldIndex = 1
    }

    response.push({
      author: getList($('a[href*="autart"]', fields.eq(fieldIndex))),
      cover: $('a.cover img', element).attr('src'),
      genres: getList($('a', fields.eq(fieldIndex + 1))),
      rate: $('.rate i', element).text(),
      release: $('a:last', fields.eq(fieldIndex)).text(),
      status: $('a:last', fields.eq(fieldIndex)).prev().prev().text(),
      title: $('.rank', element).prev().text().trim(),
      url: `${url.getBase()}${$('.rank', element).prev().attr('href')}`,
    })
  })

  return response
}

const getInfoByTitle = (html) => {
  const { window } = new JSDOM(html)
  const $ = jQuery(window);

  const response = []

  $('.manga-list .item').each((index, element) => {
    const fields = $('.info .field', element)
    let fieldIndex

    if (fields.length < 3) {
      fieldIndex = 0
    } else {
      fieldIndex = 1
    }

    response.push({
      author: getList($(`.info .field:eq(${fieldIndex}) a[href*="autart"]`, element)),
      cover: $('a.cover img', element).attr('src'),
      genres: getList($(`.info .field:eq(${fieldIndex + 1}) a`, element)),
      rate: $('.rate i', element).text(),
      release: $(`.info .field:eq(${fieldIndex}) a:eq(2)`, element).text(),
      status: $(`.info .field:eq(${fieldIndex}) a:eq(1)`, element).text(),
      title: $('.rank', element).prev().text().trim(),
      url: `${url.getBase()}${$('.rank', element).prev().attr('href')}`,
    })
  })

  return response
}

/**
 * Get the search URL for the provider
 *
 * @param {string} query
 * @param {boolean} author
 */
const getSearchUrl = (query, byAuthor = false) => {
  return `${url.getSearch()}?${byAuthor === false ? 'q=' : 'autart='}${query}`
}

/**
 *
 * @param {string} query
 * @param {boolean} byAuthor
 */
const search = async (query, byAuthor = false) => {
  try {
    const isCacheValid = await isValid(query)

    if (isCacheValid) {
      try {
        const html = await getContent(query)

        return html
      } catch (error) {
        throw error
      }
    } else {
      try {
        const html = await makeRequest(getSearchUrl(query, byAuthor))

        if (html.length > 0) {
          writeContent(query, html)
        }

        return await html
      } catch (error) {
        throw error
      }
    }
  } catch (error) {
    throw error
  }
}

const searchByAuthor = async (query) => {
  const html = await search(query, true)

  return await getInfoByAuthor(html)
}

const searchByTitle = async (query) => {
  const html = await search(query)

  return await getInfoByTitle(html)
}

module.exports = {
  searchByAuthor,
  searchByTitle,
}
