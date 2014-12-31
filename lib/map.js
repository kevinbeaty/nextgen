'use strict'

module.exports = map
function* map(f, gen){
  var next, result = {}
  while(!result.done){
    next = yield 0
    if(!next.done){
      next.value = f(next.value) 
    }
    result = gen.next(next)
  }
  return result.value
}
