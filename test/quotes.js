var assert = require( 'assert' )
var inspect = require( './inspect' )
var Link = require( '..' )

suite( 'RFC 5988', function() {

  test( 'attribute with semicolon', function() {
    var link = Link.parse( '<http://example.com/quotes/semicolons>; rel="previous"; title="previous; chapter"' )
    var refs = [{
      uri: 'http://example.com/quotes/semicolons',
      rel: 'previous',
      title: 'previous; chapter'
    }]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

  test( 'attribute with comma', function() {
    var link = Link.parse( '<http://example.com/quotes/semicolons>; rel="previous"; title="previous, chapter"' )
    var refs = [{
      uri: 'http://example.com/quotes/semicolons',
      rel: 'previous',
      title: 'previous, chapter'
    }]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

  test( 'multiple links with mixed comma & semicolon', function() {
    var link = Link.parse( '<example.com>; title="example, the second", <example-01.com>; title="alternate; version"' )
    var refs = [
      { uri: 'example.com', title: 'example, the second' },
      { uri: 'example-01.com', title: 'alternate; version' },
    ]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

  test( 'multiple links with mixed comma & semicolon', function() {
    var link = Link.parse( '<example.com>; title="example; the second", <example-01.com>; title="alternate, version"' )
    var refs = [
      { uri: 'example.com', title: 'example; the second' },
      { uri: 'example-01.com', title: 'alternate, version' },
    ]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

})
