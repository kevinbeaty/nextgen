'use strict'

module.exports = takeWhile
function* takeWhile(p, gen){
  var next,
      result = gen.next()
  while(!result.done){
    next = yield result.value
    if(next.done || p(next.value)){
      result = gen.next(next)
    } else {
      result = gen.next({done: true})
    }
  }
  return result.value
}
