'use strict'

module.exports = dropWhile
function* dropWhile(p, gen){
  var next, result = {}
  while(!result.done){
    next = yield 0
    if(next.done || !(p && p(next.value))){
      result = gen.next(next)
      p = null
    }
  }
  return result.value
}
