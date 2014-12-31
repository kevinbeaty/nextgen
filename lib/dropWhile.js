'use strict'

module.exports = dropWhile
function* dropWhile(p, gen){
  var next,
      result = gen.next()
  while(!result.done){
    next = yield result.value
    if(next.done || !(p && p(next.value))){
      result = gen.next(next)
      p = null
    }
  }
  return result.value
}
