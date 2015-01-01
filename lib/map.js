'use strict'
var value = require('./value')

module.exports = map
function* map(f, gen){
  var next,
      result = gen.next()
  while(!result.done){
    next = yield result.value
    if(!next.done){
      next = value.map(f, next)
    }
    result = gen.next(next)
  }
  return result.value
}
