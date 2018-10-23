'use strict'

const got = require('got')

const STABLE = new Set(['stable', 'node'])

function fetchRelease (keyword) {
  if (STABLE.has(keyword) || /lts\/([a-z]+)/.test(keyword) || keyword === 'lts/*') {
    return got('https://nodejs.org/dist/index.json', { json: true })
      .then(function (res) {
        let match
        if (STABLE.has(keyword)) {
          // match the latest release
          match = res.body[0]
        } else if (/lts\/([a-z]+)/.test(keyword)) {
          // match the first matching lts codename
          match = res.body.find(function (release) {
            return typeof release.lts === 'string' && release.lts.toLowerCase() === RegExp.$1
          })
        } else if (keyword === 'lts/*') {
          // match the first lts in the array
          match = res.body.find(function (release) {
            return typeof release.lts === 'string'
          })
        }

        if (match) {
          return match.version.slice(1)
        } else {
          throw new Error(`no release found for ${keyword}`)
        }
      })
  } else {
    return Promise.reject(new TypeError('invalid keyword'))
  }
}

module.exports = fetchRelease
module.exports.regexp = /^(?:stable|node|lts\/\*|lts\/[a-z]+)$/
