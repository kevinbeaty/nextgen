'use strict'
var iterator = require('transduce/iterator/iterator')

module.exports = cat
function* cat(gen){
  var next, iter, inext,
      result = gen.next()
  while(!result.done){
    next = yield result.value
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
