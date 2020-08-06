var { context, test } = require( '@jhermsmeier/control' )
var assert = require( 'assert' )
var inspect = require( './inspect' )
var Link = require( '..' )

context( 'RFC 8288', function() {

  context( '3.5 Link Header Field Examples', function() {

    // Indicates that "chapter2" is previous to this resource in a logical navigation path.
    test( 'Example 1: Previous Chapter', function() {

      var link = Link.parse(`<http://example.com/TheBook/chapter2>; rel="previous";
         title="previous chapter"`)

      var refs = [{
        uri: 'http://example.com/TheBook/chapter2',
        rel: 'previous',
        title: 'previous chapter'
      }]

      // console.log( inspect( link ) )
      assert.deepEqual( link.refs, refs )

    })

    // Indicates that the root resource ("/") is related to this resource
    // with the extension relation type "http://example.net/foo".
    test( 'Example 2: Root resource', function() {
      var link = Link.parse(`</>; rel="http://example.net/foo"`)
      var refs = [{ uri: '/', rel: 'http://example.net/foo' }]
      // console.log( inspect( link ) )
      assert.deepEqual( link.refs, refs )
    })

    test( 'Example 3: Anchors', function() {
      var link = Link.parse(`</terms>; rel="copyright"; anchor="#foo"`)
      var refs = [{
        anchor: '#foo',
        rel: 'copyright',
        uri: '/terms'
      }]
      // console.log( inspect( link ) )
      assert.deepEqual( link.refs, refs )
    })

    // Here, both links have titles encoded in UTF-8, use the German
    // language ("de"), and the second link contains the Unicode code point
    // U+00E4 ("LATIN SMALL LETTER A WITH DIAERESIS").
    test( 'Example 4: UTF-8', function() {

      var link = Link.parse(`</TheBook/chapter2>;
         rel="previous"; title*=UTF-8'de'letztes%20Kapitel,
         </TheBook/chapter4>;
         rel="next"; title*=UTF-8'de'n%c3%a4chstes%20Kapitel`)

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

    // Here, the link to "http://example.org/" has the registered relation
    // type "start" and the extension relation type
    // "http://example.net/relation/other".
    test( 'Example 5: Multiple relations', function() {

      var link = Link.parse(`<http://example.org/>;
         rel="start http://example.net/relation/other"`)

      var refs = [{
        uri: 'http://example.org/',
        rel: 'start'
      }, {
        uri: 'http://example.org/',
        rel: 'http://example.net/relation/other'
      }]

      // console.log( inspect( link ) )
      assert.deepEqual( link.refs, refs )

    })

    test( 'Example 6: Equivalence', function() {

      var link = Link.parse(`<https://example.org/>; rel="start",
         <https://example.org/index>; rel="index"`)

      var link2 = Link.parse(`<https://example.org/>; rel="start"`)
      link2.parse(`<https://example.org/index>; rel="index"`)

      // console.log( inspect( link ) )
      // console.log( inspect( link2 ) )
      assert.deepEqual( link.refs, link2.refs )

      var refs = [{
        uri: 'https://example.org/',
        rel: 'start',
      }, {
        uri: 'https://example.org/index',
        rel: 'index',
      }]

      assert.deepEqual( link.refs, refs )

    })

  })

})
