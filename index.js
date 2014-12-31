"use strict"

var ip = require('iterator-protocol'),
    iterator = ip.iterator,
    compose = require('transduce-compose'),
    slice = [].slice

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

function* arrayGen(arr){
  arr = arr || []
  while(true){
    var next = yield 0
    if(next.done){
      return arr
    }
    arr.push(next.value)
  }
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

function toArray(nextGen, iter){
  return ip.toArray(iterable(nextGen, iter))
}

function iterable(nextGen, iter) {
  return new LazyIterable(nextGen, iter)
}

function LazyIterable(gen, iter){
  this.gen = gen
  this.iter = iter
}
LazyIterable.prototype[ip.symbol] = function(){
  var iter = iterator(this.iter),
      values = [],
      result = {},
      nextGen
  nextGen = this.gen(values)
  nextGen.next();
  return {next: function(){
    while(!result.done && !values.length){
      result = nextGen.next(iter.next())
    }
    return !values.length ? result : {done: false, value: values.shift()}
  }};
}


module.exports = {
  compose: compose,
  iterable: iterable,
  toArray: toArray,
  dispatch: dispatch,
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
