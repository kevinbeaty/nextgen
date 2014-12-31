!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.nextgen=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var arrayGen = regeneratorRuntime.mark(function arrayGen() {
  var arr, next;

  return regeneratorRuntime.wrap(function arrayGen$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
    case 0:
      arr = [];
    case 1:
      if (!true) {
        context$1$0.next = 10;
        break;
      }

      context$1$0.next = 4;
      return 0;
    case 4:
      next = context$1$0.sent;

      if (!next.done) {
        context$1$0.next = 7;
        break;
      }

      return context$1$0.abrupt("return", arr);
    case 7:
      arr.push(next.value);
      context$1$0.next = 1;
      break;
    case 10:
    case "end":
      return context$1$0.stop();
    }
  }, arrayGen, this);
});

var mapGen = regeneratorRuntime.mark(function mapGen(f, gen) {
  var next, result;

  return regeneratorRuntime.wrap(function mapGen$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
    case 0:
      result = {};
    case 1:
      if (result.done) {
        context$1$0.next = 9;
        break;
      }

      context$1$0.next = 4;
      return 0;
    case 4:
      next = context$1$0.sent;
      if(!next.done){
        next.value = f(next.value) 
      }
      result = gen.next(next);
      context$1$0.next = 1;
      break;
    case 9:
      return context$1$0.abrupt("return", result.value);
    case 10:
    case "end":
      return context$1$0.stop();
    }
  }, mapGen, this);
});

var filterGen = regeneratorRuntime.mark(function filterGen(p, gen) {
  var next, result;

  return regeneratorRuntime.wrap(function filterGen$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
    case 0:
      result = {};
    case 1:
      if (result.done) {
        context$1$0.next = 8;
        break;
      }

      context$1$0.next = 4;
      return 0;
    case 4:
      next = context$1$0.sent;
      if(next.done || p(next.value)){
        result = gen.next(next)
      }
      context$1$0.next = 1;
      break;
    case 8:
      return context$1$0.abrupt("return", result.value);
    case 9:
    case "end":
      return context$1$0.stop();
    }
  }, filterGen, this);
});

var removeGen = regeneratorRuntime.mark(function removeGen(p, gen) {
  return regeneratorRuntime.wrap(function removeGen$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
    case 0:
      return context$1$0.delegateYield(filterGen(not(p), gen), "t0", 1);
    case 1:
      return context$1$0.abrupt("return", context$1$0.t0);
    case 2:
    case "end":
      return context$1$0.stop();
    }
  }, removeGen, this);
});

var takeGen = regeneratorRuntime.mark(function takeGen(n, gen) {
  var result, i;

  return regeneratorRuntime.wrap(function takeGen$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
    case 0:
      result = {}, i = 0;
    case 1:
      if (result.done) {
        context$1$0.next = 9;
        break;
      }

      context$1$0.next = 4;
      return 0;
    case 4:
      context$1$0.t1 = context$1$0.sent;
      result = gen.next(context$1$0.t1);
      if(!result.done && ++i >= n){
        result = gen.next({done: true})
      }
      context$1$0.next = 1;
      break;
    case 9:
      return context$1$0.abrupt("return", result.value);
    case 10:
    case "end":
      return context$1$0.stop();
    }
  }, takeGen, this);
});

var takeWhileGen = regeneratorRuntime.mark(function takeWhileGen(p, gen) {
  var next, result;

  return regeneratorRuntime.wrap(function takeWhileGen$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
    case 0:
      result = {};
    case 1:
      if (result.done) {
        context$1$0.next = 8;
        break;
      }

      context$1$0.next = 4;
      return 0;
    case 4:
      next = context$1$0.sent;
      if(next.done || p(next.value)){
        result = gen.next(next)
      } else {
        result = gen.next({done: true})
      }
      context$1$0.next = 1;
      break;
    case 8:
      return context$1$0.abrupt("return", result.value);
    case 9:
    case "end":
      return context$1$0.stop();
    }
  }, takeWhileGen, this);
});

var dropGen = regeneratorRuntime.mark(function dropGen(n, gen) {
  var result, next, i;

  return regeneratorRuntime.wrap(function dropGen$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
    case 0:
      result = {}, i = 0;
    case 1:
      if (result.done) {
        context$1$0.next = 8;
        break;
      }

      context$1$0.next = 4;
      return 0;
    case 4:
      next = context$1$0.sent;
      if(next.done || i++ >= n){
        result = gen.next(next)
      }
      context$1$0.next = 1;
      break;
    case 8:
      return context$1$0.abrupt("return", result.value);
    case 9:
    case "end":
      return context$1$0.stop();
    }
  }, dropGen, this);
});

var dropWhileGen = regeneratorRuntime.mark(function dropWhileGen(p, gen) {
  var next, result;

  return regeneratorRuntime.wrap(function dropWhileGen$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
    case 0:
      result = {};
    case 1:
      if (result.done) {
        context$1$0.next = 8;
        break;
      }

      context$1$0.next = 4;
      return 0;
    case 4:
      next = context$1$0.sent;
      if(next.done || !(p && p(next.value))){
        result = gen.next(next)
        p = null
      }
      context$1$0.next = 1;
      break;
    case 8:
      return context$1$0.abrupt("return", result.value);
    case 9:
    case "end":
      return context$1$0.stop();
    }
  }, dropWhileGen, this);
});

var catGen = regeneratorRuntime.mark(function catGen(gen) {
  var next, iter, inext, result;

  return regeneratorRuntime.wrap(function catGen$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
    case 0:
      result = {};
    case 1:
      if (result.done) {
        context$1$0.next = 8;
        break;
      }

      context$1$0.next = 4;
      return 0;
    case 4:
      next = context$1$0.sent;
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
      context$1$0.next = 1;
      break;
    case 8:
      return context$1$0.abrupt("return", result.value);
    case 9:
    case "end":
      return context$1$0.stop();
    }
  }, catGen, this);
});

var partitionAllGen = regeneratorRuntime.mark(function partitionAllGen(n, gen) {
  var result, next, ins;

  return regeneratorRuntime.wrap(function partitionAllGen$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
    case 0:
      result = {}, ins = [];
    case 1:
      if (result.done) {
        context$1$0.next = 11;
        break;
      }

      context$1$0.next = 4;
      return 0;
    case 4:
      next = context$1$0.sent;

      if (!next.done) {
        context$1$0.next = 7;
        break;
      }

      return context$1$0.abrupt("break", 11);
    case 7:
      ins.push(next.value);
      if(n === ins.length){
        result = gen.next({done: false, value: ins})
        ins = []
      }
      context$1$0.next = 1;
      break;
    case 11:
      if(!result.done && ins.length){
        result = gen.next({done: false, value: ins})
      }

      if(!result.done){
        result = gen.next({done: true})
      }
      return context$1$0.abrupt("return", result.value);
    case 14:
    case "end":
      return context$1$0.stop();
    }
  }, partitionAllGen, this);
});

var partitionByGen = regeneratorRuntime.mark(function partitionByGen(p, gen) {
  var result, next, ins, prev, curr;

  return regeneratorRuntime.wrap(function partitionByGen$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
    case 0:
      result = {};
    case 1:
      if (result.done) {
        context$1$0.next = 12;
        break;
      }

      prev = curr;
      context$1$0.next = 5;
      return 0;
    case 5:
      next = context$1$0.sent;

      if (!next.done) {
        context$1$0.next = 8;
        break;
      }

      return context$1$0.abrupt("break", 12);
    case 8:
      curr = p(next.value);
      if(ins === void 0){
        ins = [next.value]
      } else if(prev === curr){
        ins.push(next.value)
      } else {
        result = gen.next({done: false, value: ins})
        ins = [next.value]
      }
      context$1$0.next = 1;
      break;
    case 12:
      if(!result.done && ins.length){
        result = gen.next({done: false, value: ins})
      }

      if(!result.done){
        result = gen.next({done: true})
      }
      return context$1$0.abrupt("return", result.value);
    case 15:
    case "end":
      return context$1$0.stop();
    }
  }, partitionByGen, this);
});

var iterator = require('iterator-protocol').iterator,
    compose = require('transduce-compose'),
    slice = [].slice;

function iterate(nextGen, genAppend, iter){
  var iterNext, genNext
  var gen = nextGen(genAppend())
  gen.next()
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

function dispatch(gen){
  return function(){
      var args = slice.call(arguments)
      return function(nextGen){
        if(nextGen) nextGen.next()
        return gen.apply(null, args.concat(nextGen))
      }
  }
}

var genArray = dispatch(arrayGen)();

function toArray(nextGen, iter){
  return iterate(nextGen, genArray, iter)
}

var map = dispatch(mapGen);

var filter = dispatch(filterGen);

var remove = dispatch(removeGen);

function not(p){
  return function(val){
    return !p(val)
  }
}

var take = dispatch(takeGen);

var takeWhile = dispatch(takeWhileGen);

var drop = dispatch(dropGen);

var dropWhile = dispatch(dropWhileGen);

var cat = dispatch(catGen)();

function mapcat(f){
  return compose(map(f), cat)
}

var partitionAll = dispatch(partitionAllGen);

var partitionBy = dispatch(partitionByGen);

module.exports = {
  compose: compose,
  iterate: iterate,
  toArray: toArray,
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

},{"iterator-protocol":2,"transduce-compose":4}],2:[function(require,module,exports){
"use strict";
/* global Symbol */
var util = require('transduce-util'),
    symbol = util.protocols.iterator,
    isFunction = util.isFunction,
    keys = Object.keys || _keys,
    undef;

module.exports = {
  symbol: symbol,
  isIterable: isIterable,
  isIterator: isIterator,
  iterable: iterable,
  iterator: iterator,
  toArray: toArray
};

function toArray(iter){
  iter = iterator(iter);
  var next = iter.next(),
      arr = [];
  while(!next.done){
    arr.push(next.value);
    next = iter.next();
  }
  return arr;
}

function isIterable(value){
  return (value[symbol] !== undef);
}

function isIterator(value){
  return isIterable(value) ||
    (isFunction(value.next));
}

function iterable(value){
  var it;
  if(isIterable(value)){
    it = value;
  } else if(util.isArray(value) || util.isString(value)){
    it = new ArrayIterable(value);
  } else if(isFunction(value)){
    it = new FunctionIterable(value);
  } else {
    it = new ObjectIterable(value);
  }
  return it;
}

function iterator(value){
  var it = iterable(value);
  if(it !== undef){
    it = it[symbol]();
  } else if(isFunction(value.next)){
    // handle non-well-formed iterators that only have a next method
    it = value;
  }
  return it;
}

// Wrap an Array into an iterable
function ArrayIterable(arr){
  this.arr = arr;
}
ArrayIterable.prototype[symbol] = function(){
  var arr = this.arr,
      idx = 0;
  return {
    next: function(){
      if(idx >= arr.length){
        return {done: true};
      }

      return {done: false, value: arr[idx++]};
    }
  };
};

// Wrap an function into an iterable that calls function on every next
function FunctionIterable(fn){
  this.fn = fn;
}
FunctionIterable.prototype[symbol] = function(){
  var fn = this.fn;
  return {
    next: function(){
      return {done: false, value: fn()};
    }
  };
};

// Wrap an Object into an iterable. iterates [key, val]
function ObjectIterable(obj){
  this.obj = obj;
  this.keys = keys(obj);
}
ObjectIterable.prototype[symbol] = function(){
  var obj = this.obj,
      keys = this.keys,
      idx = 0;
  return {
    next: function(){
      if(idx >= keys.length){
        return {done: true};
      }
      var key = keys[idx++];
      return {done: false, value: [key, obj[key]]};
    }
  };
};

function _keys(obj){
  var prop, keys = [];
  for(prop in obj){
    if(obj.hasOwnProperty(prop)){
      keys.push(prop);
    }
  }
  return keys;
}

},{"transduce-util":3}],3:[function(require,module,exports){
"use strict";
var undef,
    Arr = Array,
    toString = Object.prototype.toString,
    isArray = (isFunction(Arr.isArray) ? Arr.isArray : predicateToString('Array')),
    /* global Symbol */
    symbolExists = typeof Symbol !== 'undefined',
    symIterator = symbolExists ? Symbol.iterator : '@@iterator',
    /* jshint newcap:false */
    symTransformer = symbolExists ? Symbol('transformer') : '@@transformer',
    protocols = {
      iterator: symIterator,
      transformer: symTransformer
    };

module.exports = {
  protocols: protocols,
  isFunction: isFunction,
  isArray: isArray,
  isString: predicateToString('String'),
  isRegExp: predicateToString('RegExp'),
  isNumber: predicateToString('Number'),
  isUndefined: isUndefined,
  identity: identity,
  arrayPush: push,
  objectMerge: merge,
  stringAppend: append
};

function isFunction(value){
  return typeof value === 'function';
}

function isUndefined(value){
  return value === undef;
}

function predicateToString(type){
  var str = '[object '+type+']';
  return function(value){
    return toString.call(value) === str;
  };
}

function identity(result){
  return result;
}

function push(result, input){
  result.push(input);
  return result;
}

function merge(result, input){
  if(isArray(input) && input.length === 2){
    result[input[0]] = input[1];
  } else {
    var prop;
    for(prop in input){
      if(input.hasOwnProperty(prop)){
        result[prop] = input[prop];
      }
    }
  }
  return result;
}

function append(result, input){
  return result + input;
}

},{}],4:[function(require,module,exports){
"use strict";
module.exports = compose;
function compose(){
  var fns = arguments;
  return function(xf){
    var i = fns.length;
    while(i--){
      xf = fns[i](xf);
    }
    return xf;
  };
}

},{}]},{},[1])(1)
});