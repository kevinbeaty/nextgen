"use strict"
import {iterator} from 'iterator-protocol'
import compose from 'transduce-compose'

export {compose}

var slice = Array.prototype.slice

export function iterate(nextGen, genAppend, iter){
  var iterNext, genNext
  var gen = init(nextGen(genAppend()))
  iter = iterator(iter)
  while(true){
    iterNext = iter.next()
    genNext = gen.next(iterNext)
    if(iterNext.done || genNext.done){
      break
    }
  }
  return genNext.value
}

export function init(nextGen){
  if(nextGen){
    var gen = nextGen()
    gen.next()
    return gen
  }
}

export function dispatch(gen){
  return function(){
      var args = slice.call(arguments)
      return (nextGen) => () => gen.apply(null, args.concat(init(nextGen)))
  }
}

export var genArray = dispatch(arrayGen)()
function* arrayGen(){
  var arr = []
  while(true){
    var next = yield 0
    if(next.done){
      return arr
    }
    arr.push(next.value)
  }
}

export function toArray(nextGen, iter){
  return iterate(nextGen, genArray, iter)
}

export var map = dispatch(mapGen)
function* mapGen(f, gen){
  var next, result = {}
  while(!result.done){
    next = yield 0
    if(!next.done){
      next.value = f(next.value) 
    }
    result = gen.next(next)
  }
  return result.value
}

export var filter = dispatch(filterGen)
function* filterGen(p, gen){
  var next, result = {}
  while(!result.done){
    next = yield 0
    if(next.done || p(next.value)){
      result = gen.next(next)
    }
  }
  return result.value
}

export var remove = dispatch(removeGen)
function* removeGen(p, gen){
  return yield* filterGen(not(p), gen)
}

function not(p){
  return function(val){
    return !p(val)
  }
}

export var take = dispatch(takeGen)
function* takeGen(n, gen){
  var result = {}, i = 0
  while(!result.done){
    result = gen.next(yield 0)
    if(!result.done && ++i >= n){
      result = gen.next({done: true})
    }
  }
  return result.value
}

export var takeWhile = dispatch(takeWhileGen)
function* takeWhileGen(p, gen){
  var next, result = {}
  while(!result.done){
    next = yield 0
    if(next.done || p(next.value)){
      result = gen.next(next)
    } else {
      result = gen.next({done: true})
    }
  }
  return result.value
}

export var drop = dispatch(dropGen)
function* dropGen(n, gen){
  var result = {}, next, i = 0
  while(!result.done){
    next = yield 0
    if(next.done || i++ >= n){
      result = gen.next(next)
    }
  }
  return result.value
}

export var dropWhile = dispatch(dropWhileGen)
function* dropWhileGen(p, gen){
  var next, result = {}
  while(!result.done){
    next = yield 0
    if(next.done || !(p && p(next.value))){
      result = gen.next(next)
      p = null
    }
  }
  return result.value
}

export var cat = dispatch(catGen)()
function* catGen(gen){
  var next, iter, inext, result = {}
  while(!result.done){
    next = yield 0
    if(next.done){
      result = gen.next(next)
    } else {
      iter = iterator(next.value)
      inext = iter.next()
      while(!inext.done && !result.done){
        result = gen.next(inext)
        inext = iter.next()
      }
    }
  }
  return result.value
}

export function mapcat(f){
  return compose(map(f), cat)
}

export var partitionAll = dispatch(partitionAllGen)
function* partitionAllGen(n, gen){
  var result = {}, next, ins = []
  while(!result.done){
    next = yield 0
    if(next.done){
      break
    }

    ins.push(next.value)
    if(n === ins.length){
      result = gen.next({done: false, value: ins})
      ins = []
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

export var partitionBy = dispatch(partitionByGen)
function* partitionByGen(p, gen){
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
