var util = require( 'util' )
var options = { depth: null, colors: process.stdout.isTTY }

function inspect( value ) {
  return util.inspect( value, options )
}

inspect.log = function( value ) {
  process.stdout.write( inspect( value ) )
  process.stdout.write( '\n' )
}

module.exports = inspect
