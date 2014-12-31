'use strict'

module.exports = take
function* take(n, gen){
  var i = 0,
      result = gen.next()
  while(!result.done){
    result = gen.next(yield result.value)
    if(!result.done && ++i >= n){
      result = gen.next({done: true})
    }
  }
  return result.value
}
