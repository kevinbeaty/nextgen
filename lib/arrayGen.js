'use strict'

module.exports = arrayGen
function* arrayGen(arr){
  arr = arr || []
  while(true){
    var next = yield arr
    if(next.done){
      return arr
    }
    arr.push(next.value)
  }
}
