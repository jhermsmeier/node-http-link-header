# HTTP Link Header
[![npm](https://img.shields.io/npm/v/http-link-header.svg?style=flat-square)](https://npmjs.com/http-link-header)
[![npm license](https://img.shields.io/npm/l/http-link-header.svg?style=flat-square)](https://npmjs.com/http-link-header)
[![npm downloads](https://img.shields.io/npm/dm/http-link-header.svg?style=flat-square)](https://npmjs.com/http-link-header)
[![build status](https://img.shields.io/travis/jhermsmeier/node-http-link-header.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-http-link-header)

Parse & format HTTP link headers according to [RFC 5988]

[RFC 5988]: https://tools.ietf.org/html/rfc5988

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save http-link-header
```

## Status

It can currently parse (almost) everything according to the RFC,
with exception of a few cases where control chars show up in attribute values:

- attribute contains semicolon
- attribute contains comma
- multiple links contain mixed comma & semicolon

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
link.rel( 'alternate' )
> { uri: 'example-01.com', rel: 'alternate', title: 'Alternate Example Domain' }
```

```js
link.has( 'rel', 'alternate' )
> true
```

```js
link.get( 'title', 'alternate' )
> { uri: 'example-01.com', rel: 'alternate', title: 'Alternate Example Domain' }
```
