const jQuery = require('jquery')
const jsdom = require('jsdom')

const { JSDOM } = jsdom

const { makeRequest } = require('./common')
const { getContent, isValid, writeContent } = require('./../../cache')
const url = require('./config')

const buildUrl = (name) => {
  return `${url.getChapter()}/${name}`
}

const getChapter = async (name) => {
  try {
    const isCacheValid = await isValid(`${name}`, true)

    if (isCacheValid) {
      try {
        const html = await getContent(name, true)

        return await getInfo(html)
      } catch (error) {
        throw error
      }
    } else {
      try {
        const html = await makeRequest(buildUrl(name))

        if (html.length > 0) {
          writeContent(name, html, true)
        }

        return await getInfo(html)
      } catch (error) {
        throw error
      }
    }
  } catch (error) {
    throw error
  }
}

const getInfo = (html) => {
  const { window } = new JSDOM(html)
  const $ = jQuery(window);

  const response = []
  const chapters = $('.book-list .stream:last a.ch')

  let chapterIndex = chapters.length
  chapters.each((index, element) => {
    const link = $(element)

    response.push({
      chapter: `Chapter ${String(chapterIndex)
        .padStart(String(chapters.length).length, '0')}`,
      title: link.parent().text().replace(link.text(), '').trim(),
      url: `${url.getBase()}${link.attr('href')}`,
    })

    chapterIndex -= 1
  })

  return response
}

module.exports = {
  getChapter,
}
