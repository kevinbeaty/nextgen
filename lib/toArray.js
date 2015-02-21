'use strict'
var iterable = require('./iterable'),
    iterator = require('./util').iterator

module.exports = toArray
function toArray(nextGen, itera){
  var iter = iterator(iterable(nextGen, itera)),
      next = iter.next(),
      arr = []
  while(!next.done){
    arr.push(next.value)
    next = iter.next()
  }
  return arr
}
