var { context, test } = require( '@jhermsmeier/control' )
var assert = require( 'assert' )
var inspect = require( './inspect' )
var Link = require( '..' )

context( 'HTTP Link Header', function() {

  test( 'standalone link (without rel)', function() {
    var link = Link.parse( '<example.com>' )
    var refs = [ { uri: 'example.com' } ]
    // inspect.log( link )
    assert.deepEqual( link.refs, refs )
  })

  test( 'link with rel', function() {
    var link = Link.parse( '<example.com>; rel=example' )
    var refs = [ { uri: 'example.com', rel: 'example' } ]
    // inspect.log( link )
    assert.deepEqual( link.refs, refs )
  })

  test( 'link with quoted rel', function() {
    var link = Link.parse( '<example.com>; rel="example"' )
    var refs = [ { uri: 'example.com', rel: 'example' } ]
    // inspect.log( link )
    assert.deepEqual( link.refs, refs )
  })

  test( 'multiple links', function() {
    var link = Link.parse( '<example.com>; rel="example", <example-01.com>; rel="alternate"' )
    var refs = [
      { uri: 'example.com', rel: 'example' },
      { uri: 'example-01.com', rel: 'alternate' },
    ]
    // inspect.log( link )
    assert.deepEqual( link.refs, refs )
  })

  test( 'link with mixed quotes', function() {
    var link = Link.parse( '<example.com>; rel="example", <example-01.com>; rel=alternate' )
    var refs = [
      { uri: 'example.com', rel: 'example' },
      { uri: 'example-01.com', rel: 'alternate' },
    ]
    // inspect.log( link )
    assert.deepEqual( link.refs, refs )
  })

  // The "rel" parameter MUST NOT appear more than once in a given
  // link-value; occurrences after the first MUST be ignored by parsers.
  test( 'multiple rel attributes on same link', function() {
    var link = Link.parse( '<example.com>; rel="example"; rel="invalid"' )
    var refs = [
      { uri: 'example.com', rel: 'example' },
    ]
    // inspect.log( link )
    assert.deepEqual( link.refs, refs )
  })

  test( 'link with backslash escape in attribute', function() {
    var link = Link.parse( '<example.com>; rel="example"; title="Something of \\"importance\\"' )
    var refs = [
      { uri: 'example.com', rel: 'example', title: 'Something of "importance"' },
    ]
    // inspect.log( link )
    assert.deepEqual( link.refs, refs )
  })

  test( 'link with leading WS before delimiter', function() {
    var link = Link.parse( '<example.com>; rel= example; title = Something' )
    var refs = [
      { uri: 'example.com', rel: 'example', title: 'Something' },
    ]
    // inspect.log( link )
    assert.deepEqual( link.refs, refs )
  })

  context( 'toString()', function() {

    test( 'link with doublequote in anchor', function() {
      var link = new Link()
      link.refs.push({ uri: 'example.com', rel: 'example', anchor: '/#anch"00"' })
      var expected = '<example.com>; rel=example; anchor="/#anch\\"00\\""'
      var actual = link.toString()
      assert.strictEqual( actual, expected )
    })

    // See https://tools.ietf.org/html/rfc8288#section-3
    test( 'rel should not be URL encoded', function() {
      var value = '<https://api.github.com/user/repos?page=3&per_page=100>; rel="next", <https://api.github.com/user/repos?page=50&per_page=100>; rel="last"'
      var expected = '<https://api.github.com/user/repos?page=3&per_page=100>; rel=next, <https://api.github.com/user/repos?page=50&per_page=100>; rel=last'
      var link = Link.parse( value )
      var refs = [{
        uri: 'https://api.github.com/user/repos?page=3&per_page=100',
        rel: 'next',
      }, {
        uri: 'https://api.github.com/user/repos?page=50&per_page=100',
        rel: 'last',
      }]
      // inspect.log( link )
      assert.deepEqual( link.refs, refs )
      assert.strictEqual( link.toString(), expected )
    })

    test( 'type should not be URL encoded', function() {
      var value = '</foo>; rel=alternate; type=application/hal+json'
      var link = Link.parse( value )
      var refs = [
        { uri: '/foo', rel: 'alternate', type: 'application/hal+json' }
      ]
      // inspect.log( link )
      assert.deepEqual( link.refs, refs )
      assert.strictEqual( link.toString(), value )
    })

  })

  test( 'handle varying attribute cardinality', function() {
    var value = '</example>; rel=alternate; hreflang=en-US; hreflang=de; type=text/html; media=screen; media="should be ignored"'
    var expected = '</example>; rel=alternate; hreflang=en-US; hreflang=de; type=text/html; media=screen'
    var link = Link.parse( value )
    var refs = [
      { uri: '/example', rel: 'alternate', hreflang: [ 'en-US', 'de' ], type: 'text/html', media: 'screen' }
    ]
    // inspect.log( link )
    assert.deepEqual( link.refs, refs )
    assert.strictEqual( link.toString(), expected )
  })

})
