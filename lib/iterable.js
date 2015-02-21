'use strict'
var util = require('./util'),
    iterator = util.iterator,
    symbol = util.symbol,
    value = require('./value')

module.exports = iterable
function iterable(nextGen, iter) {
  return new LazyIterable(nextGen, iter)
}

function LazyIterable(gen, iter){
  this.gen = gen
  this.iter = iter
}
LazyIterable.prototype[symbol] = function(){
  var iter = iterator(this.iter),
      nextGen = this.gen([]),
      result = nextGen.next()
  return {next: function(){
    while(!result.value.length && !result.done){
      result = nextGen.next(iter.next())
    }
    return !result.value.length ? result : value.map(shift, result)
  }}
}

function shift(value){
  return value.shift()
}
