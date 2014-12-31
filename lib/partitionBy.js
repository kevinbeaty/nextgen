'use strict'

module.exports = partitionBy
function* partitionBy(p, gen){
  var result = {}, next, ins, prev, curr
  while(!result.done){
    prev = curr
    next = yield 0
    if(next.done){
      break
    }
    curr = p(next.value)
    if(ins === void 0){
      ins = [next.value]
    } else if(prev === curr){
      ins.push(next.value)
    } else {
      result = gen.next({done: false, value: ins})
      ins = [next.value]
    }
  }

  if(!result.done && ins.length){
    result = gen.next({done: false, value: ins})
  }

  if(!result.done){
    result = gen.next({done: true})
  }
  return result.value
}
