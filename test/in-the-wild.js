var { context, test } = require( '@jhermsmeier/control' )
var assert = require( 'assert' )
var inspect = require( './inspect' )
var Link = require( '..' )

context( 'Link Headers In the Wild', function() {

  test( 'LetsEncrypt TOS link', function() {
    var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
    var refs = [{
      uri: 'https://acme-staging.api.letsencrypt.org/acme/new-authz',
      rel: 'next'
    }, {
      uri: 'https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf',
      rel: 'terms-of-service'
    }]
    // inspect.log( link )
    assert.deepEqual( link.refs, refs )
  })

  test( 'GitHub pagination links', function() {
    var link = Link.parse( '<https://api.github.com/user/repos?page=3&per_page=100>; rel="next", <https://api.github.com/user/repos?page=50&per_page=100>; rel="last"' )
    var refs = [{
      uri: 'https://api.github.com/user/repos?page=3&per_page=100',
      rel: 'next',
    }, {
      uri: 'https://api.github.com/user/repos?page=50&per_page=100',
      rel: 'last',
    }]
    // inspect.log( link )
    assert.deepEqual( link.refs, refs )
  })

})
