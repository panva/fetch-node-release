'use strict'

const got = require('got')

const STABLE = new Set(['stable', 'node'])

function fetchRelease (keyword) {
  let location

  if (STABLE.has(keyword)) {
    location = Promise.resolve('https://nodejs.org/dist/latest/')
  } else if (/lts\/([a-z]+)/.test(keyword)) {
    location = Promise.resolve(`https://nodejs.org/dist/latest-${RegExp.$1}/`)
  } else if (keyword === 'lts/*') {
    location = got('https://nodejs.org/dist/').then(function (res) {
      const lts = res.body
        .split('\n')
        .map(function (line) {
          return /latest-([a-z]+)\//.test(line) && RegExp.$1
        })
        .filter(Boolean)
        .sort()
        .reverse()

      return `https://nodejs.org/dist/latest-${lts[0]}/`
    })
  } else {
    location = Promise.reject(new TypeError('invalid keyword'))
  }

  return location.then(function (url) {
    return got(url)
      .then(function (res) {
        const match = res.body
          .split('\n')
          .find(function (line) {
            return /<\/a>/.test(line) && /([0-9]+\.[0-9]+\.[0-9]+)/.test(line)
          })

        const release = match && RegExp.$1

        if (!release) {
          throw new Error(`no release found for ${keyword}`)
        }

        return release
      })
  })
}

module.exports = fetchRelease
module.exports.regexp = /^(?:stable|node|lts\/\*|lts\/[a-z]+)$/
