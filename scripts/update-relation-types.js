var https = require( 'https' )
var fs = require( 'fs' )
var path = require( 'path' )
var csv = require( 'csv-parse' )

// See https://www.iana.org/assignments/link-relations/link-relations.xhtml
var url = 'https://www.iana.org/assignments/link-relations/link-relations-1.csv'
var filename = path.join( __dirname, '..', 'lib', 'relation-types.json' )

https.get( url, ( res ) => {

  if( res.statusCode !== 200 ) {
    throw new Error( `HTTP ${res.statusCode}: ${res.statusMessage} – ${url}` )
  }

  var parser = new csv.Parser()
  var header = null
  var relationTypes = []

  res.pipe( parser ).on( 'readable', function() {
    var row = null
    while( row = this.read() ) {
      if( header != null ) {
        relationTypes.push( row[0] )
      } else {
        header = row
      }
    }
  })
  .on( 'end', function() {
    var data = JSON.stringify( relationTypes, null, 2 )
    fs.writeFile( filename, data, ( error ) => {
      if( error ) throw error
    })
  })

})
