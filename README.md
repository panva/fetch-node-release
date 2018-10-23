# fetch-node-release

[![build][travis-image]][travis-url]

Fetch latest Node.js release version by keyword such as `stable`, `lts/carbon` or `lts/*`.


[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Usage

```js
const fetch = require('fetch-node-release');

(async () => {
  let version;
  // fetch latest stable version
  version = await fetch('stable');
  console.log('latest stable', version);

  // fetch latest lts/boron version
  version = await fetch('lts/boron');
  console.log('latest lts/boron', version);

  // fetch latest lts version
  version = await fetch('lts/*');
  console.log('latest lts', version);
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
```

## Caveats

- fetches data from `https://nodejs.org/dist/` so it will reject if there's no internet access or
  upon HTTP failures
- will reject if you provide invalid lts branch name
- will explode the moment node lts releases run out of alphabet ;)

[travis-image]: https://api.travis-ci.com/panva/fetch-node-release.svg?branch=master
[travis-url]: https://travis-ci.com/panva/fetch-node-release
