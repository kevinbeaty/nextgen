'use strict'
var ip = require('iterator-protocol'),
    iterator = ip.iterator

module.exports = iterable
function iterable(nextGen, iter) {
  return new LazyIterable(nextGen, iter)
}

function LazyIterable(gen, iter){
  this.gen = gen
  this.iter = iter
}
LazyIterable.prototype[ip.symbol] = function(){
  var iter = iterator(this.iter),
      values, result, nextGen
  nextGen = this.gen(values)
  result = nextGen.next();
  return {next: function(){
    while(!result.value.length && !result.done){
      result = nextGen.next(iter.next())
    }
    return !result.value.length ? result : {done: false, value: result.value.shift()}
  }};
}
