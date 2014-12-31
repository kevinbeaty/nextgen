'use strict'

module.exports = drop 
function* drop(n, gen){
  var next, i = 0,
      result = gen.next()
  while(!result.done){
    next = yield result.value
    if(next.done || i++ >= n){
      result = gen.next(next)
    }
  }
  return result.value
}
