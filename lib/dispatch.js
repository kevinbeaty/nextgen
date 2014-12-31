'use strict'
var arrayGen = require('./arrayGen'),
    slice = [].slice

module.exports = dispatch
function dispatch(gen){
  return function(){
      var args = slice.call(arguments)
      return function(nextGen){
        if(nextGen === void 0 || Array.isArray(nextGen)){
          nextGen = arrayGen(nextGen)
        }
        nextGen.next()
        return gen.apply(null, args.concat(nextGen))
      }
  }
}
