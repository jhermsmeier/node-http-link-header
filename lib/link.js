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
        return link + '; ' + attr + '="' + ref[ attr ] + '"'
      }, '<' + ref.uri + '>' )
      refs.push( link )
    }

    return refs.join( ', ' )

  },

}

// Exports
module.exports = Link
