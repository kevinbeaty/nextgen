!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.nextgen=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'
var compose = require('transduce-compose'),
    dispatch = require('./lib/dispatch'),
    map = dispatch(require('./lib/map')),
    cat = dispatch(require('./lib/cat'))()

module.exports = {
  compose: compose,
  iterable: require('./lib/iterable'),
  toArray: require('./lib/toArray'),
  dispatch: dispatch,
  map: map,
  filter: dispatch(require('./lib/filter')),
  remove: dispatch(require('./lib/remove')),
  take: dispatch(require('./lib/take')),
  takeWhile: dispatch(require('./lib/takeWhile')),
  drop: dispatch(require('./lib/drop')),
  dropWhile: dispatch(require('./lib/dropWhile')),
  cat: cat,
  mapcat: mapcat,
  partitionAll: dispatch(require('./lib/partitionAll')),
  partitionBy: dispatch(require('./lib/partitionBy'))
}

function mapcat(f){
  return compose(map(f), cat)
}

},{"./lib/cat":3,"./lib/dispatch":4,"./lib/drop":5,"./lib/dropWhile":6,"./lib/filter":7,"./lib/iterable":8,"./lib/map":9,"./lib/partitionAll":10,"./lib/partitionBy":11,"./lib/remove":12,"./lib/take":13,"./lib/takeWhile":14,"./lib/toArray":15,"transduce-compose":19}],2:[function(require,module,exports){
  'use strict';

  var arrayGen = regeneratorRuntime.mark(function arrayGen(arr) {
    var next;

    return regeneratorRuntime.wrap(function arrayGen$(context$3$0) {
      while (1) switch (context$3$0.prev = context$3$0.next) {
      case 0:
        arr = arr || [];
      case 1:
        if (!true) {
          context$3$0.next = 10;
          break;
        }

        context$3$0.next = 4;
        return arr;
      case 4:
        next = context$3$0.sent;

        if (!next.done) {
          context$3$0.next = 7;
          break;
        }

        return context$3$0.abrupt("return", arr);
      case 7:
        arr.push(next.value);
        context$3$0.next = 1;
        break;
      case 10:
      case "end":
        return context$3$0.stop();
      }
    }, arrayGen, this);
  });

  module.exports = arrayGen;
},{}],3:[function(require,module,exports){
  'use strict';

  var cat = regeneratorRuntime.mark(function cat(gen) {
    var next, iter, inext, result;

    return regeneratorRuntime.wrap(function cat$(context$3$0) {
      while (1) switch (context$3$0.prev = context$3$0.next) {
      case 0:
        result = gen.next();
      case 1:
        if (result.done) {
          context$3$0.next = 8;
          break;
        }

        context$3$0.next = 4;
        return result.value;
      case 4:
        next = context$3$0.sent;
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
        context$3$0.next = 1;
        break;
      case 8:
        return context$3$0.abrupt("return", result.value);
      case 9:
      case "end":
        return context$3$0.stop();
      }
    }, cat, this);
  });

  var iterator = require('iterator-protocol').iterator;

  module.exports = cat;
},{"iterator-protocol":17}],4:[function(require,module,exports){
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
      return gen.apply(null, args.concat(nextGen))
    }
  }
}

},{"./arrayGen":2}],5:[function(require,module,exports){
  'use strict';

  var drop = regeneratorRuntime.mark(function drop(n, gen) {
    var next, i, result;

    return regeneratorRuntime.wrap(function drop$(context$3$0) {
      while (1) switch (context$3$0.prev = context$3$0.next) {
      case 0:
        i = 0, result = gen.next();
      case 1:
        if (result.done) {
          context$3$0.next = 8;
          break;
        }

        context$3$0.next = 4;
        return result.value;
      case 4:
        next = context$3$0.sent;
        if(next.done || i++ >= n){
          result = gen.next(next)
        }
        context$3$0.next = 1;
        break;
      case 8:
        return context$3$0.abrupt("return", result.value);
      case 9:
      case "end":
        return context$3$0.stop();
      }
    }, drop, this);
  });

  module.exports = drop;
},{}],6:[function(require,module,exports){
  'use strict';

  var dropWhile = regeneratorRuntime.mark(function dropWhile(p, gen) {
    var next, result;

    return regeneratorRuntime.wrap(function dropWhile$(context$3$0) {
      while (1) switch (context$3$0.prev = context$3$0.next) {
      case 0:
        result = gen.next();
      case 1:
        if (result.done) {
          context$3$0.next = 8;
          break;
        }

        context$3$0.next = 4;
        return result.value;
      case 4:
        next = context$3$0.sent;
        if(next.done || !(p && p(next.value))){
          result = gen.next(next)
          p = null
        }
        context$3$0.next = 1;
        break;
      case 8:
        return context$3$0.abrupt("return", result.value);
      case 9:
      case "end":
        return context$3$0.stop();
      }
    }, dropWhile, this);
  });

  module.exports = dropWhile;
},{}],7:[function(require,module,exports){
  'use strict';

  var filter = regeneratorRuntime.mark(function filter(p, gen) {
    var next, result;

    return regeneratorRuntime.wrap(function filter$(context$3$0) {
      while (1) switch (context$3$0.prev = context$3$0.next) {
      case 0:
        result = gen.next();
      case 1:
        if (result.done) {
          context$3$0.next = 8;
          break;
        }

        context$3$0.next = 4;
        return result.value;
      case 4:
        next = context$3$0.sent;
        if(next.done || p(next.value)){
          result = gen.next(next)
        }
        context$3$0.next = 1;
        break;
      case 8:
        return context$3$0.abrupt("return", result.value);
      case 9:
      case "end":
        return context$3$0.stop();
      }
    }, filter, this);
  });

  module.exports = filter;
},{}],8:[function(require,module,exports){
'use strict'
var ip = require('iterator-protocol'),
    iterator = ip.iterator,
    value = require('./value')

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
      nextGen = this.gen([]),
      result = nextGen.next()
  return {next: function(){
    while(!result.value.length && !result.done){
      result = nextGen.next(iter.next())
    }
    return !result.value.length ? result : value.map(shift, result)
  }}
}

function shift(value){
  return value.shift()
}

},{"./value":16,"iterator-protocol":17}],9:[function(require,module,exports){
  'use strict';

  var map = regeneratorRuntime.mark(function map(f, gen) {
    var next, result;

    return regeneratorRuntime.wrap(function map$(context$3$0) {
      while (1) switch (context$3$0.prev = context$3$0.next) {
      case 0:
        result = gen.next();
      case 1:
        if (result.done) {
          context$3$0.next = 9;
          break;
        }

        context$3$0.next = 4;
        return result.value;
      case 4:
        next = context$3$0.sent;
        if(!next.done){
          next = value.map(f, next)
        }
        result = gen.next(next);
        context$3$0.next = 1;
        break;
      case 9:
        return context$3$0.abrupt("return", result.value);
      case 10:
      case "end":
        return context$3$0.stop();
      }
    }, map, this);
  });

  var value = require('./value');

  module.exports = map;
},{"./value":16}],10:[function(require,module,exports){
  'use strict';

  var partitionAll = regeneratorRuntime.mark(function partitionAll(n, gen) {
    var next, ins, result;

    return regeneratorRuntime.wrap(function partitionAll$(context$3$0) {
      while (1) switch (context$3$0.prev = context$3$0.next) {
      case 0:
        ins = [], result = gen.next();
      case 1:
        if (result.done) {
          context$3$0.next = 11;
          break;
        }

        context$3$0.next = 4;
        return result.value;
      case 4:
        next = context$3$0.sent;

        if (!next.done) {
          context$3$0.next = 7;
          break;
        }

        return context$3$0.abrupt("break", 11);
      case 7:
        ins.push(next.value);
        if(n === ins.length){
          result = gen.next(value.of(ins))
          ins = []
        }
        context$3$0.next = 1;
        break;
      case 11:
        if(!result.done && ins.length){
          result = gen.next(value.of(ins))
        }

        if(!result.done){
          result = gen.next(value.done())
        }
        return context$3$0.abrupt("return", result.value);
      case 14:
      case "end":
        return context$3$0.stop();
      }
    }, partitionAll, this);
  });

  var value = require('./value');

  module.exports = partitionAll;
},{"./value":16}],11:[function(require,module,exports){
  'use strict';

  var partitionBy = regeneratorRuntime.mark(function partitionBy(p, gen) {
    var next, ins, prev, curr, result;

    return regeneratorRuntime.wrap(function partitionBy$(context$3$0) {
      while (1) switch (context$3$0.prev = context$3$0.next) {
      case 0:
        result = gen.next();
      case 1:
        if (result.done) {
          context$3$0.next = 12;
          break;
        }

        prev = curr;
        context$3$0.next = 5;
        return result.value;
      case 5:
        next = context$3$0.sent;

        if (!next.done) {
          context$3$0.next = 8;
          break;
        }

        return context$3$0.abrupt("break", 12);
      case 8:
        curr = p(next.value);
        if(ins === void 0){
          ins = [next.value]
        } else if(prev === curr){
          ins.push(next.value)
        } else {
          result = gen.next(value.of(ins))
          ins = [next.value]
        }
        context$3$0.next = 1;
        break;
      case 12:
        if(!result.done && ins.length){
          result = gen.next(value.of(ins))
        }

        if(!result.done){
          result = gen.next(value.done())
        }
        return context$3$0.abrupt("return", result.value);
      case 15:
      case "end":
        return context$3$0.stop();
      }
    }, partitionBy, this);
  });

  var value = require('./value');

  module.exports = partitionBy;
},{"./value":16}],12:[function(require,module,exports){
  'use strict';

  var remove = regeneratorRuntime.mark(function remove(p, gen) {
    return regeneratorRuntime.wrap(function remove$(context$3$0) {
      while (1) switch (context$3$0.prev = context$3$0.next) {
      case 0:
        return context$3$0.delegateYield(filter(not(p), gen), "t0", 1);
      case 1:
        return context$3$0.abrupt("return", context$3$0.t0);
      case 2:
      case "end":
        return context$3$0.stop();
      }
    }, remove, this);
  });

  var filter = require('./filter');

  module.exports = remove;

  function not(p){
    return function(val){
      return !p(val)
    }
  }
},{"./filter":7}],13:[function(require,module,exports){
  'use strict';

  var take = regeneratorRuntime.mark(function take(n, gen) {
    var i, result;

    return regeneratorRuntime.wrap(function take$(context$3$0) {
      while (1) switch (context$3$0.prev = context$3$0.next) {
      case 0:
        i = 0, result = gen.next();
      case 1:
        if (result.done) {
          context$3$0.next = 9;
          break;
        }

        context$3$0.next = 4;
        return result.value;
      case 4:
        context$3$0.t1 = context$3$0.sent;
        result = gen.next(context$3$0.t1);
        if(!result.done && ++i >= n){
          result = gen.next({done: true})
        }
        context$3$0.next = 1;
        break;
      case 9:
        return context$3$0.abrupt("return", result.value);
      case 10:
      case "end":
        return context$3$0.stop();
      }
    }, take, this);
  });

  module.exports = take;
},{}],14:[function(require,module,exports){
  'use strict';

  var takeWhile = regeneratorRuntime.mark(function takeWhile(p, gen) {
    var next, result;

    return regeneratorRuntime.wrap(function takeWhile$(context$3$0) {
      while (1) switch (context$3$0.prev = context$3$0.next) {
      case 0:
        result = gen.next();
      case 1:
        if (result.done) {
          context$3$0.next = 8;
          break;
        }

        context$3$0.next = 4;
        return result.value;
      case 4:
        next = context$3$0.sent;
        if(next.done || p(next.value)){
          result = gen.next(next)
        } else {
          result = gen.next({done: true})
        }
        context$3$0.next = 1;
        break;
      case 8:
        return context$3$0.abrupt("return", result.value);
      case 9:
      case "end":
        return context$3$0.stop();
      }
    }, takeWhile, this);
  });

  module.exports = takeWhile;
},{}],15:[function(require,module,exports){
'use strict'
var ip = require('iterator-protocol'),
    iterable = require('./iterable')

module.exports = toArray
function toArray(nextGen, iter){
  return ip.toArray(iterable(nextGen, iter))
}

},{"./iterable":8,"iterator-protocol":17}],16:[function(require,module,exports){
'use strict'

module.exports = {
  of: of,
  map: map,
  done: done
}

function map(f, result){
  return of(f(result.value))
}

function of(value){
  return {done: false, value: value}
}

function done(value){
  return {done: true, value: value}
}

},{}],17:[function(require,module,exports){
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

},{"transduce-util":18}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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
