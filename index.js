"use strict"

var iterator = require('iterator-protocol').iterator,
    compose = require('transduce-compose'),
    slice = [].slice

function iterate(nextGen, genAppend, iter){
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

function init(nextGen){
  if(nextGen){
    var gen = nextGen()
    gen.next()
    return gen
  }
}

function dispatch(gen){
  return function(){
      var args = slice.call(arguments)
      return function(nextGen){
        return function(){
          return gen.apply(null, args.concat(init(nextGen)))
        }
      }
  }
}

var genArray = dispatch(arrayGen)()
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

function toArray(nextGen, iter){
  return iterate(nextGen, genArray, iter)
}

var map = dispatch(mapGen)
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

var filter = dispatch(filterGen)
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

var remove = dispatch(removeGen)
function* removeGen(p, gen){
  return yield* filterGen(not(p), gen)
}

function not(p){
  return function(val){
    return !p(val)
  }
}

var take = dispatch(takeGen)
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

var takeWhile = dispatch(takeWhileGen)
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

var drop = dispatch(dropGen)
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

var dropWhile = dispatch(dropWhileGen)
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

var cat = dispatch(catGen)()
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

function mapcat(f){
  return compose(map(f), cat)
}

var partitionAll = dispatch(partitionAllGen)
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

var partitionBy = dispatch(partitionByGen)
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

module.exports = {
  compose: compose,
  iterate: iterate,
  toArray: toArray,
  init: init,
  dispatch: dispatch,
  genArray: genArray,
  map: map,
  filter: filter,
  remove: remove,
  take: take,
  takeWhile: takeWhile,
  drop: drop,
  dropWhile: dropWhile,
  cat: cat,
  mapcat: mapcat,
  partitionAll: partitionAll,
  partitionBy: partitionBy
}
