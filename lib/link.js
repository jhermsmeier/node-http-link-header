var querystring = require( 'querystring' )

/**
 * Link
 * @constructor
 * @return {Link}
 */
function Link( value ) {

  if( !(this instanceof Link) ) {
    return new Link( value )
  }

  this.refs = []

}

function trim( value ) {
  return value.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '' )
}

function parseLine( value ) {

  var pattern = /(?:[^;].*?)(?:[^\\](?=;)|$)/g
  var match = null
  var parts = []

  while( match = pattern.exec( value ) ) {
    parts.push( trim( match[0] ) )
  }

  return parts

}

// TODO: Prob. needs to check against more
// encodings we can handle with `querystring`
function isCompatibleEncoding( value ) {
  return /^utf-?8|ascii$/i.test( value )
}

function parseExtendedValue( value ) {
  var parts = /([^']+)?(?:'([^']+)')?(.+)/.exec( value )
  return {
    language: parts[2].toLowerCase(),
    encoding: isCompatibleEncoding( parts[1] ) ?
      null : parts[1].toLowerCase(),
    value: isCompatibleEncoding( parts[1] ) ?
      querystring.unescape( parts[3] ) : parts[3]
  }
}

function parseAttr( link, attr ) {

  var parts = /([^\=\*]+(\*)?)\=(["']?)(.+)(\3)/.exec( attr )
  var key = parts[1].toLowerCase()
  var hasEncoding = !!parts[2]
  var quotes = parts[3]
  var value = parts[4]

  link[key] = hasEncoding ?
    parseExtendedValue( value ) :
    querystring.unescape( value )

  return link

}

function parseAttrs( parts ) {

  var uri = parts.shift()
    .replace( /^\s*|\s*$/g, '' )
    .replace( /^<|>$/g, '' )

  var link = { uri: uri }

  for( var i = 0; i < parts.length; i++ ) {
    parseAttr( link, parts[i] )
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

  has: function( attr, value ) {
    return this.get( attr, value ) != null
  },

  parse: function( value ) {

    var pattern = /([^,].*?)(?:[^\\](?=,)|$)/g
    var match = null
    var link = null

    // Unfold folded lines
    value = value.replace( /\r?\n[\x20\x09]+/g, '' )

    while( match = pattern.exec( value ) ) {
      link = parseAttrs( parseLine( trim( match[0] ) ) )
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
