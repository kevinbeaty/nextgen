'use strict'

module.exports = map
function* map(f, gen){
  var next,
      result = gen.next()
  while(!result.done){
    next = yield result.value
    if(!next.done){
      next.value = f(next.value) 
    }
    result = gen.next(next)
  }
  return result.value
}
