var bench = require( 'nanobench' )
var Link = require( '..' )

var ITERATIONS = 100000

bench( `http-link-header .parse() ⨉ ${ITERATIONS}`, function( run ) {

  var value = '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"'
  var link = null

  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    link = Link.parse( value )
  }
  run.end()

})

bench( `http-link-header #toString() ⨉ ${ITERATIONS}`, function( run ) {

  var value = '<https://acme-staging.api.letsencrypt.org/acme/new-authz>;rel="next", <https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf>;rel="terms-of-service"'
  var link = Link.parse( value )

  run.start()
  for( var i = 0; i < ITERATIONS; i++ ) {
    value = link.toString()
  }
  run.end()

})
