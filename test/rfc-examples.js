var assert = require( 'assert' )
var inspect = require( './inspect' )
var Link = require( '..' )

suite( 'RFC 5988', function() {

  test( 'Example 01', function() {
    // indicates that "chapter2" is previous to this resource in a logical navigation path.
    var link = Link.parse( '<http://example.com/TheBook/chapter2>; rel="previous"; title="previous chapter"' )
    var refs = [{
      uri: 'http://example.com/TheBook/chapter2',
      rel: 'previous',
      title: 'previous chapter'
    }]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

  test( 'Example 02', function() {
    // indicates that the root resource ("/") is related to this resource
    // with the extension relation type "http://example.net/foo".
    var link = Link.parse( '</>; rel="http://example.net/foo"' )
    var refs = [ { uri: '/', rel: 'http://example.net/foo' } ]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

  test( 'Example 03', function() {
    // Here, both links have titles encoded in UTF-8, use the German
    // language ("de"), and the second link contains the Unicode code point
    // U+00E4 ("LATIN SMALL LETTER A WITH DIAERESIS").
    var link = Link.parse( '</TheBook/chapter2>; rel="previous"; title*=UTF-8\'de\'letztes%20Kapitel, </TheBook/chapter4>; rel="next"; title*=UTF-8\'de\'n%c3%a4chstes%20Kapitel' )
    var refs = [{
      uri: '/TheBook/chapter2',
      rel: 'previous',
      'title*': { language: 'de', encoding: null, value: 'letztes Kapitel' }
    }, {
      uri: '/TheBook/chapter4',
      rel: 'next',
      'title*': { language: 'de', encoding: null, value: 'nächstes Kapitel' }
     }]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

  test( 'Example 04', function() {
    // Here, the link to "http://example.org/" has the registered relation
    // type "start" and the extension relation type
    // "http://example.net/relation/other".
    var link = Link.parse( '<http://example.org/>; rel="start http://example.net/relation/other"' )
    var refs = [{
      uri: 'http://example.org/',
      rel: 'start http://example.net/relation/other'
    }]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

})
