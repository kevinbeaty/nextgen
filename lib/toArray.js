'use strict'
var ip = require('iterator-protocol'),
    iterable = require('./iterable')

module.exports = toArray
function toArray(nextGen, iter){
  return ip.toArray(iterable(nextGen, iter))
}
