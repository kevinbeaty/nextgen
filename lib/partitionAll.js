'use strict'
var value = require('./value')

module.exports = partitionAll
function* partitionAll(n, gen){
  var next, ins = [],
      result = gen.next()
  while(!result.done){
    next = yield result.value
    if(next.done){
      break
    }

    ins.push(next.value)
    if(n === ins.length){
      result = gen.next(value.of(ins))
      ins = []
    }
  }

  if(!result.done && ins.length){
    result = gen.next(value.of(ins))
  }

  if(!result.done){
    result = gen.next(value.done())
  }
  return result.value
}
