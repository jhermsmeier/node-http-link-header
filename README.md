# HTTP Link Header
[![npm](https://img.shields.io/npm/v/http-link-header.svg?style=flat-square)](https://npmjs.com/http-link-header)
[![npm license](https://img.shields.io/npm/l/http-link-header.svg?style=flat-square)](https://npmjs.com/http-link-header)
[![npm downloads](https://img.shields.io/npm/dm/http-link-header.svg?style=flat-square)](https://npmjs.com/http-link-header)
[![build status](https://img.shields.io/travis/jhermsmeier/node-http-link-header.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-http-link-header)

Parse & format HTTP link headers according to RFC 5988

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save http-link-header
```

## Usage

```js
var LinkHeader = require( 'http-link-header' )
```

```js
var link = LinkHeader.parse(
  '<example.com>; rel="example"; title="Example Website", ' +
  '<example-01.com>; rel="alternate"; title="Alternate Example Domain"'
)

> Link {
  refs: [
    { uri: 'example.com', rel: 'example', title: 'Example Website' },
    { uri: 'example-01.com', rel: 'alternate', title: 'Alternate Example Domain' },
  ]
}
```

```js
link.has( 'rel', 'alternate' )
> true
```

```js
link.get( 'rel', 'alternate' )
> { uri: 'example-01.com', rel: 'alternate', title: 'Alternate Example Domain' }
```
