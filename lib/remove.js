'use strict'
var filter = require('./filter')

module.exports = remove
function* remove(p, gen){
  return yield* filter(not(p), gen)
}

function not(p){
  return function(val){
    return !p(val)
  }
}
