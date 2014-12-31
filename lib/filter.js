'use strict'

module.exports = filter
function* filter(p, gen){
  var next, result = {}
  while(!result.done){
    next = yield 0
      if(next.done || p(next.value)){
        result = gen.next(next)
      }
  }
  return result.value
}
