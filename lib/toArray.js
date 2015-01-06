'use strict'
var iterToArray = require('transduce/iterator/iteratorToArray'),
    iterable = require('./iterable')

module.exports = toArray
function toArray(nextGen, iter){
  return iterToArray(iterable(nextGen, iter))
}
