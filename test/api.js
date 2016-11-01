var assert = require( 'assert' )
var inspect = require( './inspect' )
var Link = require( '..' )

suite( 'API', function() {

  test( 'get("rel", "next")', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    // console.log( link.get( 'rel', 'next' ) )
    assert.deepEqual( link.get( 'rel', 'next' ), {
      uri: 'https://acme-staging.api.letsencrypt.org/acme/new-authz',
      rel: 'next'
    })
  })

  test( 'rel("next")', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    // console.log( link.ret( 'next' ) )
    assert.deepEqual( link.rel( 'next' ), {
      uri: 'https://acme-staging.api.letsencrypt.org/acme/new-authz',
      rel: 'next'
    })
  })

  test( 'has("rel", "next")', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    // console.log( link.has( 'rel', 'next' ) )
    assert.deepEqual( link.has( 'next' ), true )
  })

  test( 'toString()', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    var expected = '<https://acme-staging.api.letsencrypt.org/acme/new-authz>; rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>; rel="terms-of-service"'
    assert.equal( link.toString(), expected )
  })

})
