const url = {
  getBase: () => 'https://mangapark.me',
  getSearch: () => `${url.getBase()}/search`,
  getChapter: () => `${url.getBase()}/manga`,
}

module.exports = url