var assert = require( 'assert' )
var inspect = require( './inspect' )
var Link = require( '..' )

suite( 'HTTP Link Header', function() {

  test( 'standalone link (without rel)', function() {
    var link = Link.parse( '<example.com>' )
    var refs = [ { uri: 'example.com' } ]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

  test( 'link with rel', function() {
    var link = Link.parse( '<example.com>; rel=example' )
    var refs = [ { uri: 'example.com', rel: 'example' } ]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

  test( 'link with quoted rel', function() {
    var link = Link.parse( '<example.com>; rel="example"' )
    var refs = [ { uri: 'example.com', rel: 'example' } ]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

  test( 'multiple links', function() {
    var link = Link.parse( '<example.com>; rel="example", <example-01.com>; rel="alternate"' )
    var refs = [
      { uri: 'example.com', rel: 'example' },
      { uri: 'example-01.com', rel: 'alternate' },
    ]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

  test( 'link with mixed quotes', function() {
    var link = Link.parse( '<example.com>; rel="example", <example-01.com>; rel=alternate' )
    var refs = [
      { uri: 'example.com', rel: 'example' },
      { uri: 'example-01.com', rel: 'alternate' },
    ]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

  // The "rel" parameter MUST NOT appear more than once in a given
  // link-value; occurrences after the first MUST be ignored by parsers.
  test( 'multiple links with same rel', function() {
    var link = Link.parse( '<example.com>; rel="example", <example-01.com>; rel="example"' )
    var refs = [
      { uri: 'example.com', rel: 'example' },
    ]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

})
