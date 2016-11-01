var assert = require( 'assert' )
var inspect = require( './inspect' )
var Link = require( '..' )

suite( 'Encodings', function() {

  test( 'UTF-8', function() {
    var link = Link.parse( '</risk-mitigation>; rel="start"; title*=UTF-8\'en\'%E2%91%A0%E2%93%AB%E2%85%93%E3%8F%A8%E2%99%B3%F0%9D%84%9E%CE%BB' )
    var refs = [{
      uri: '/risk-mitigation',
      rel: 'start',
      'title*': {
        language: 'en',
        encoding: null,
        value: '①⓫⅓㏨♳𝄞λ'
      },
    }]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

  test( 'GB2312', function() {
    var link = Link.parse( '</risk-mitigation>; rel="start"; title*=GB2312\'cn\'%C6%F3%20%D2%B5%20%B2%C3%20%D4%B1%20%B7%E7%20%CF%D5%20%B9%E6%20%B1%DC%30%34%3A%33%37%3A%32%31' )
    var refs = [{
      uri: '/risk-mitigation',
      rel: 'start',
      'title*': {
        language: 'cn',
        encoding: 'gb2312',
        value: '%C6%F3%20%D2%B5%20%B2%C3%20%D4%B1%20%B7%E7%20%CF%D5%20%B9%E6%20%B1%DC%30%34%3A%33%37%3A%32%31'
      },
    }]
    // console.log( inspect( link ) )
    assert.deepEqual( link.refs, refs )
  })

})
