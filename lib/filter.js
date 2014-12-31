'use strict'

module.exports = filter
function* filter(p, gen){
  var next,
      result = gen.next()
  while(!result.done){
    next = yield result.value
    if(next.done || p(next.value)){
      result = gen.next(next)
    }
  }
  return result.value
}
