var assert = require( 'assert' )
var inspect = require( './inspect' )
var Link = require( '..' )

suite( 'Folded header', function() {

  test( 'unfolds header', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next",\r\n <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="ter\r\n ms-of-service"' )
    var refs = [{
      uri: 'https://acme-staging.api.letsencrypt.org/acme/new-authz',
      rel: 'next'
    }, {
      uri: 'https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf',
      rel: 'terms-of-service'
    }]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

  test( 'unfolds hard-folded header', function() {
    var link = Link.parse( '<https://acme-staging.api.let\r\n sencrypt.org/acme/new-authz>;\r\n rel="next", <https://letsencr\r\n ypt.org/documents/LE-SA-v1.1.\r\n 1-August-1-2016.pdf>;rel="ter\r\n ms-of-service"' )
    var refs = [{
      uri: 'https://acme-staging.api.letsencrypt.org/acme/new-authz',
      rel: 'next'
    }, {
      uri: 'https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf',
      rel: 'terms-of-service'
    }]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

})
