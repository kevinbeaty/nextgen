'use strict'

module.exports = takeWhile
function* takeWhile(p, gen){
  var next, result = {}
  while(!result.done){
    next = yield 0
    if(next.done || p(next.value)){
      result = gen.next(next)
    } else {
      result = gen.next({done: true})
    }
  }
  return result.value
}
