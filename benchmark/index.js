var Link = require( '..' )

suite( 'http-link-header', function() {

  bench( 'parse', function() {
    return Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )
  })

  var link = Link.parse( '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"' )

  bench( 'toString', function() {
    return link.toString()
  })

})
