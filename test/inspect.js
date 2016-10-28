var util = require( 'util' )
var options = {
  depth: null,
  colors: true,
}

module.exports = function inspect( value ) {
  return util.inspect( value, options )
}
