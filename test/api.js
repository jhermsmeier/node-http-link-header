var assert = require( 'assert' )
var inspect = require( './inspect' )
var Link = require( '..' )

suite( 'API', function() {

  test( 'get("rel", "next")', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    // console.log( inspect( link.get( 'rel', 'next' ) ) )
    assert.deepEqual( link.get( 'rel', 'next' ), {
      uri: 'https://acme-staging.api.letsencrypt.org/acme/new-authz',
      rel: 'next'
    })
  })

  test( 'rel("next")', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    // console.log( inspect( link.ret( 'next' ) ) )
    assert.deepEqual( link.rel( 'next' ), {
      uri: 'https://acme-staging.api.letsencrypt.org/acme/new-authz',
      rel: 'next'
    })
  })

  test( 'has("rel", "next")', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    // console.log( inspect( link.has( 'rel', 'next' ) ) )
    assert.deepEqual( link.has( 'next' ), true )
  })

  test( 'toString()', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    var expected = '<https://acme-staging.api.letsencrypt.org/acme/new-authz>; rel=next, <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>; rel="terms-of-service"'
    assert.equal( link.toString(), expected )
  })

  test( 'set( add )', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    link.set({
      uri: 'https://github.com/ietf-wg-acme/acme/',
      rel: 'example'
    })
    // console.log( inspect( link ) )
    assert.equal( link.refs.length, 3 )
    assert.deepEqual( link.get( 'rel', 'example' ), {
      uri: 'https://github.com/ietf-wg-acme/acme/',
      rel: 'example'
    })
  })

  test( 'set( overwrite )', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    link.set({
      uri: 'https://not-the-same.com/',
      rel: 'next'
    })
    // console.log( inspect( link ) )
    assert.equal( link.refs.length, 2 )
    assert.deepEqual( link.get( 'rel', 'next' ), {
      uri: 'https://not-the-same.com/',
      rel: 'next'
    })
  })

})
