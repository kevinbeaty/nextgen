'use strict'
var value = require('./value')

module.exports = partitionBy
function* partitionBy(p, gen){
  var next, ins, prev, curr,
      result = gen.next()
  while(!result.done){
    prev = curr
    next = yield result.value
    if(next.done){
      break
    }
    curr = p(next.value)
    if(ins === void 0){
      ins = [next.value]
    } else if(prev === curr){
      ins.push(next.value)
    } else {
      result = gen.next(value.of(ins))
      ins = [next.value]
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
