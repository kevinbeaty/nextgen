'use strict'

module.exports = take
function* take(n, gen){
  var result = {}, i = 0
  while(!result.done){
    result = gen.next(yield 0)
    if(!result.done && ++i >= n){
      result = gen.next({done: true})
    }
  }
  return result.value
}
