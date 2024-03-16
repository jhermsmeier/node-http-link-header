var assert = require( 'assert' )
var inspect = require( './inspect' )
var Link = require( '..' )

context( 'API', function() {

  test( 'get("rel", "next")', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    // console.log( inspect( link.get( 'rel', 'next' ) ) )
    assert.deepEqual( link.get( 'rel', 'next' )[0], {
      uri: 'https://acme-staging.api.letsencrypt.org/acme/new-authz',
      rel: 'next'
    })
  })

  test( 'rel("next")', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    // console.log( inspect( link.ret( 'next' ) ) )
    assert.deepEqual( link.rel( 'next' )[0], {
      uri: 'https://acme-staging.api.letsencrypt.org/acme/new-authz',
      rel: 'next'
    })
  })

  test( 'has("rel", "next")', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    // console.log( inspect( link.has( 'rel', 'next' ) ) )
    assert.deepEqual( link.has( 'rel', 'next' ), true )
  })

  test( 'has("rel", "prev")', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    // console.log( inspect( link.has( 'rel', 'prev' ) ) )
    assert.deepEqual( link.has( 'rel', 'prev' ), false )
  })

  test( 'toString()', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    var expected = '<https://acme-staging.api.letsencrypt.org/acme/new-authz>; rel=next, <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>; rel=terms-of-service'
    assert.equal( link.toString(), expected )
  })

  test( 'set()', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    link.set({
      uri: 'https://github.com/ietf-wg-acme/acme/',
      rel: 'example'
    })
    // console.log( inspect( link ) )
    assert.equal( link.refs.length, 3 )
    assert.deepEqual( link.get( 'rel', 'example' )[0], {
      uri: 'https://github.com/ietf-wg-acme/acme/',
      rel: 'example'
    })
  })

  test( 'set()', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    link.set({
      uri: 'https://not-the-same.com/',
      rel: 'next'
    })
    // console.log( inspect( link ) )
    assert.equal( link.refs.length, 3 )
    assert.equal( link.get( 'rel', 'next' ).length, 2 )
    assert.deepEqual( link.get( 'rel', 'next' )[1], {
      uri: 'https://not-the-same.com/',
      rel: 'next'
    })
  })

  test( 'set()', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    link.set({
      uri: 'https://not-the-same.com/',
      rel: 'next'
    })
    // console.log( inspect( link ) )
    assert.equal( link.refs.length, 3 )
    assert.deepEqual( link.get( 'rel', 'next' )[0], {
      uri: 'https://acme-staging.api.letsencrypt.org/acme/new-authz',
      rel: 'next'
    })
  })

  test( 'setUnique()', function() {
    var link = new Link()
    link.setUnique( { uri: 'https://example.com/a', rel: 'preconnect' } )
    assert.deepEqual(
      link.refs,
      [
        { uri: 'https://example.com/a', rel: 'preconnect' }
      ]
    )
    link.setUnique( { uri: 'https://example.com/b', rel: 'preconnect' } )
    assert.deepEqual(
      link.refs,
      [
        { uri: 'https://example.com/a', rel: 'preconnect' },
        { uri: 'https://example.com/b', rel: 'preconnect' }
      ]
    )
    link.setUnique( { uri: 'https://example.com/a', rel: 'preconnect' } )
    assert.deepEqual(
      link.refs,
      [
        { uri: 'https://example.com/a', rel: 'preconnect' },
        { uri: 'https://example.com/b', rel: 'preconnect' }
      ]
    )
  })

  test( 'parse() multiple', function() {

    var links = new Link()

    links.parse( '<example.com>; rel="example"; title="Example Website"' )
    assert.deepEqual( links, {
      refs: [
        { uri: 'example.com', rel: 'example', title: 'Example Website' },
      ]
    })

    links.parse( '<example-01.com>; rel="alternate"; title="Alternate Example Domain"' )
    assert.deepEqual( links, {
      refs: [
        { uri: 'example.com', rel: 'example', title: 'Example Website' },
        { uri: 'example-01.com', rel: 'alternate', title: 'Alternate Example Domain' },
      ]
    })

    links.parse( '<example-02.com>; rel="alternate"; title="Second Alternate Example Domain"' )
    assert.deepEqual( links, {
      refs: [
        { uri: 'example.com', rel: 'example', title: 'Example Website' },
        { uri: 'example-01.com', rel: 'alternate', title: 'Alternate Example Domain' },
        { uri: 'example-02.com', rel: 'alternate', title: 'Second Alternate Example Domain' },
      ]
    })

  })

  // NOTE: While empty relations are non-compliant,
  // these tests are here to ensure that the rel comparison
  // doesn't fluke out on empty strings / falsy values
  context( 'Attribute Value Comparisons', () => {
    context( 'Empty Relations', () => {

      test( 'has("rel", "")', function() {
        var link = Link.parse( '<example.com>; rel=' )
        assert.deepEqual( link.has( 'rel', '' ), true )
      })

      test( 'get("rel", "")', function() {
        var link = Link.parse( '<example.com>; rel=' )
        assert.deepEqual( link.get( 'rel', '' )[0], {
          uri: 'example.com',
          rel: ''
        })
      })

      test( 'rel("")', function() {
        var link = Link.parse( '<example.com>; rel=' )
        assert.deepEqual( link.rel( '' )[0], {
          uri: 'example.com',
          rel: ''
        })
      })

    })
  })

})
