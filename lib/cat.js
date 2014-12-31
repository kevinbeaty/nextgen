'use strict'
var iterator = require('iterator-protocol').iterator

module.exports = cat
function* cat(gen){
  var next, iter, inext, result = {}
  while(!result.done){
    next = yield 0
    if(next.done){
      result = gen.next(next)
    } else {
      iter = iterator(next.value)
      inext = iter.next()
      while(!inext.done && !result.done){
        result = gen.next(inext)
        inext = iter.next()
      }
    }
  }
  return result.value
}
