var querystring = require( 'querystring' )
var trim = require( './trim' )

/**
 * Link
 * @constructor
 * @return {Link}
 */
function Link( value ) {

  if( !(this instanceof Link) ) {
    return new Link( value )
  }

  /** @type {Array} URI references */
  this.refs = []

}

/**
 * General matching pattern
 * @type {RegExp}
 */
Link.pattern = /(?:\<([^\>]+)\>)((\s*;\s*([a-z\*]+)=(("[^"]+")|('[^']+')|([^\,\;]+)))*)(\s*,\s*|$)/gi

/**
 * Attribute matching pattern
 * @type {RegExp}
 */
Link.attrPattern = /([a-z\*]+)=(?:(?:"([^"]+)")|(?:'([^']+)')|([^\,\;]+))/gi

/**
 * Determines whether an encoding can be
 * natively handled with a `Buffer`
 * @param {String} value
 * @return {Boolean}
 */
Link.isCompatibleEncoding = function( value ) {
  return /^utf-?8|ascii|utf-?16-?le|ucs-?2|base-?64|latin-?1$/i.test( value )
}

/**
 * Format a given extended attribute and it's value
 * @param {String} attr
 * @param {Object} data
 * @return {String}
 */
Link.formatExtendedAttribute = function( attr, data ) {

    var encoding = ( data.encoding || 'utf-8' ).toUpperCase()
    var language = data.language || 'en'

    var encodedValue = ''

    if( Buffer.isBuffer( data.value ) && Link.isCompatibleEncoding( encoding ) ) {
      encodedValue = data.value.toString( encoding )
    } else if( Buffer.isBuffer( data.value ) ) {
      encodedValue = data.value.toString( 'hex' )
        .replace( /[0-9a-f]{2}/gi, '%$1' )
    } else {
      encodedValue = querystring.escape( data.value )
    }

    return attr + '=' + encoding + '\'' +
      language + '\'' + encodedValue

}

/**
 * Format a given attribute and it's value
 * @param {String} attr
 * @param {String|Object} value
 * @return {String}
 */
Link.formatAttribute = function( attr, value ) {

  // NOTE: Properly test this condition
  if( /\*$/.test( attr ) || typeof value !== 'string' )
    return Link.formatExtendedAttribute( attr, value )

  // Strictly, not all values matching this
  // selector would need quotes, but it's better to be safe
  var needsQuotes = /[^a-z]/i.test( value )

  if( needsQuotes ) {
    // We don't need to escape <SP> <,> <;>
    value = querystring.escape( value )
      .replace( /%20/g, ' ' )
      .replace( /%2C/g, ',' )
      .replace( /%3B/g, ';' )

    value = '"' + value + '"'
  }

  return attr + '=' + value

}

/**
 * Parses an extended value and attempts to decode it
 * @internal
 * @param {String} value
 * @return {Object}
 */
Link.parseExtendedValue = function( value ) {
  var parts = /([^']+)?(?:'([^']+)')?(.+)/.exec( value )
  return {
    language: parts[2].toLowerCase(),
    encoding: Link.isCompatibleEncoding( parts[1] ) ?
      null : parts[1].toLowerCase(),
    value: Link.isCompatibleEncoding( parts[1] ) ?
      querystring.unescape( parts[3] ) : parts[3]
  }
}

/**
 * Parses out URI attributes
 * @internal
 * @param {Object} link
 * @param {String} parts
 * @return {Object} link
 */
Link.parseAttrs = function( link, parts ) {

  var match = null
  var key = ''
  var value = ''

  while( match = Link.attrPattern.exec( parts ) ) {
    key = match[1].toLowerCase()
    value = match[4] || match[3] || match[2]
    if( /\*$/.test( key ) ) {
      link[ key ] = Link.parseExtendedValue( value )
    } else if( /%/.test( value ) ) {
      link[ key ] = querystring.unescape( value )
    } else {
      link[ key ] = value
    }
  }

  return link

}

Link.parse = function( value ) {
  return new Link().parse( value )
}

/**
 * Link prototype
 * @type {Object}
 */
Link.prototype = {

  constructor: Link,

  rel: function( value ) {
    for( var i = 0; i < this.refs.length; i++ ) {
      if( this.refs[ i ].rel === value ) {
        return this.refs[ i ]
      }
    }
  },

  get: function( attr, value ) {

    attr = attr.toLowerCase()

    for( var i = 0; i < this.refs.length; i++ ) {
      if( this.refs[ i ][ attr ] === value ) {
        return this.refs[ i ]
      }
    }

  },

  set: function( link ) {

    var old = this.rel( link.rel )

    old != null ?
      this.refs.splice( this.refs.indexOf( old ), 1, link ) :
      this.refs.push( link )

    return this

  },

  has: function( attr, value ) {
    return this.get( attr, value ) != null
  },

  parse: function( value ) {

    // Unfold folded lines
    value = trim( value )
      .replace( /\r?\n[\x20\x09]+/g, '' )

    var match = null

    while( match = Link.pattern.exec( value ) ) {
      var link = Link.parseAttrs({ uri: match[1] }, match[0] )
      if( this.rel( link.rel ) != null ) continue;
      this.refs.push( link )
    }

    return this

  },

  toString: function() {

    var refs = []
    var link = ''
    var ref = null

    for( var i = 0; i < this.refs.length; i++ ) {
      ref = this.refs[i]
      link = Object.keys( this.refs[i] ).reduce( function( link, attr ) {
        if( attr === 'uri' ) return link
        return link + '; ' + Link.formatAttribute( attr, ref[ attr ] )
      }, '<' + ref.uri + '>' )
      refs.push( link )
    }

    return refs.join( ', ' )

  },

}

// Exports
module.exports = Link
