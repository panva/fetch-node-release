/* eslint-env mocha */
'use strict'

const assert = require('assert')
const fs = require('fs')

const nock = require('nock')

const fetch = require('../lib')

describe('fetch-node-release()', function () {
  afterEach(function () {
    nock.cleanAll()
  });

  ['stable', 'node'].forEach(function (keyword) {
    it(`fetches latest version when keyword is ${keyword}`, function () {
      nock('https://nodejs.org')
        .get('/dist/index.json')
        .reply(200, fs.readFileSync('test/vcr/dist.json'))

      return fetch(keyword)
        .then(function (version) {
          assert(nock.isDone())
          assert.strictEqual(version, '11.0.0')
        })
    })
  })

  it('fetches specific lts when keyword is e.g. lts/carbon', function () {
    nock('https://nodejs.org')
      .get('/dist/index.json')
      .reply(200, fs.readFileSync('test/vcr/dist.json'))

    return fetch('lts/carbon')
      .then(function (version) {
        assert(nock.isDone())
        assert.strictEqual(version, '8.12.0')
      })
  })

  it('fetches latest lts branch when keyword is lts/*', function () {
    nock('https://nodejs.org')
      .get('/dist/index.json')
      .reply(200, fs.readFileSync('test/vcr/dist.json'))

    return fetch('lts/*')
      .then(function (version) {
        assert(nock.isDone())
        assert.strictEqual(version, '8.12.0')
      })
  })

  it('rejects when no node version is found', function () {
    nock('https://nodejs.org')
      .get('/dist/index.json')
      .reply(200, fs.readFileSync('test/vcr/dist.json'))

    return fetch('lts/foo')
      .then(function () {
        throw new Error('rejection expected')
      }, function (err) {
        assert(nock.isDone())
        assert(err instanceof Error)
        assert.strictEqual(err.message, 'no release found for lts/foo')
      })
  })

  it('rejects when nodejs dist doesn\'t return', function () {
    nock('https://nodejs.org')
      .get('/dist/index.json')
      .reply(404)

    return fetch('lts/foo')
      .then(function () {
        throw new Error('rejection expected')
      }, function (err) {
        assert(nock.isDone())
        assert(err instanceof Error)
        assert.strictEqual(err.message, 'Response code 404 (Not Found)')
      })
  })

  it('rejects with TypeError when keyword is invalid', function () {
    return fetch('bogus')
      .then(function () {
        throw new Error('rejection expected')
      }, function (err) {
        assert(err instanceof TypeError)
        assert.strictEqual(err.message, 'invalid keyword')
      })
  })
})

describe('fetch-node-release.regexp', function () {
  ['stable', 'node', 'lts/argon', 'lts/boron', 'lts/carbon', 'lts/dubnium', 'lts/foo', 'lts/*'].forEach(function (match) {
    it(`matches ${match}`, function () {
      assert(fetch.regexp.test(match))
    })
  });

  ['latest', 'lts/Argon', 'lts/'].forEach(function (nomatch) {
    it(`doesn't match ${nomatch}`, function () {
      assert(!fetch.regexp.test(nomatch))
    })
  })
})
