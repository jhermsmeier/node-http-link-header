var assert = require( 'assert' )
var inspect = require( './inspect' )
var Link = require( '..' )

suite( 'Attributes', function() {

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
    var link = Link.parse( '<example.com>; rel="example, the second", <example-01.com>; rel="alternate; version"' )
    var refs = [
      { uri: 'example.com', rel: 'example, the second' },
      { uri: 'example-01.com', rel: 'alternate; version' },
    ]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

  test( 'multiple links with mixed comma & semicolon', function() {
    var link = Link.parse( '<example.com>; rel="example; the second", <example-01.com>; rel="alternate, version"' )
    var refs = [
      { uri: 'example.com', rel: 'example; the second' },
      { uri: 'example-01.com', rel: 'alternate, version' },
    ]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

  test( 'format attr value with nothing special', function() {
    var link = new Link().set({ uri: 'example.com', rel: 'next' })
    var expected = '<example.com>; rel=next'
    assert.deepEqual( link.toString(), expected )
  })

  test( 'format attr value with semicolon', function() {
    var link = new Link().set({ uri: 'example.com', rel: 'example; the semicolon' })
    var expected = '<example.com>; rel="example; the semicolon"'
    assert.deepEqual( link.toString(), expected )
  })

  test( 'format attr value with comma', function() {
    var link = new Link().set({ uri: 'example.com', rel: 'example, the comma' })
    var expected = '<example.com>; rel="example, the comma"'
    assert.deepEqual( link.toString(), expected )
  })

  test( 'format attr value with single quote', function() {
    var link = new Link().set({ uri: 'example.com', rel: 'example\' the single quote' })
    var expected = '<example.com>; rel="example\' the single quote"'
    assert.deepEqual( link.toString(), expected )
  })

  test( 'format attr value with double quote', function() {
    var link = new Link().set({ uri: 'example.com', rel: 'example', title: 'example" the double quote' })
    var expected = '<example.com>; rel=example; title="example%22 the double quote"'
    assert.deepEqual( link.toString(), expected )
  })

  test( 'format attr value with multi-byte char', function() {
    var link = new Link().set({ uri: 'example.com', rel: 'example', title: 'example with ⅓' })
    var expected = '<example.com>; rel=example; title="example with %E2%85%93"'
    assert.deepEqual( link.toString(), expected )
  })

  test( 'format an extended attr value', function() {
    var expected = '</risk-mitigation>; rel=start; title*=UTF-8\'en\'%E2%91%A0%E2%93%AB%E2%85%93%E3%8F%A8%E2%99%B3%F0%9D%84%9E%CE%BB'
    var link = new Link().set({
      uri: '/risk-mitigation',
      rel: 'start',
      'title*': {
        language: 'en',
        encoding: null,
        value: '①⓫⅓㏨♳𝄞λ'
      },
    })
    assert.deepEqual( link.toString(), expected )
  })

})
