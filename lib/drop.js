'use strict'

module.exports = drop 
function* drop(n, gen){
  var result = {}, next, i = 0
  while(!result.done){
    next = yield 0
    if(next.done || i++ >= n){
      result = gen.next(next)
    }
  }
  return result.value
}
