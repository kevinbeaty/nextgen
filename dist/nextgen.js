!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.nextgen=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function() {
  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  if (typeof regeneratorRuntime === "object") {
    return;
  }

  var runtime = regeneratorRuntime =
    typeof exports === "undefined" ? {} : exports;

  function wrap(innerFn, outerFn, self, tryList) {
    return new Generator(innerFn, outerFn, self || null, tryList || []);
  }
  runtime.wrap = wrap;

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    genFun.__proto__ = GeneratorFunctionPrototype;
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  runtime.async = function(innerFn, outerFn, self, tryList) {
    return new Promise(function(resolve, reject) {
      var generator = wrap(innerFn, outerFn, self, tryList);
      var callNext = step.bind(generator.next);
      var callThrow = step.bind(generator["throw"]);

      function step(arg) {
        try {
          var info = this(arg);
          var value = info.value;
        } catch (error) {
          return reject(error);
        }

        if (info.done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(callNext, callThrow);
        }
      }

      callNext();
    });
  };

  function Generator(innerFn, outerFn, self, tryList) {
    var generator = outerFn ? Object.create(outerFn.prototype) : this;
    var context = new Context(tryList);
    var state = GenStateSuspendedStart;

    function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          try {
            var info = delegate.iterator[method](arg);

            // Delegate generator ran and handled its own exceptions so
            // regardless of what the method was, we continue as if it is
            // "next" with an undefined arg.
            method = "next";
            arg = undefined;

          } catch (uncaught) {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = uncaught;

            continue;
          }

          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedStart &&
              typeof arg !== "undefined") {
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
            throw new TypeError(
              "attempt to send " + JSON.stringify(arg) + " to newborn generator"
            );
          }

          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            delete context.sent;
          }

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        try {
          var value = innerFn.call(self, context);

          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: value,
            done: context.done
          };

          if (value === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } catch (thrown) {
          state = GenStateCompleted;

          if (method === "next") {
            context.dispatchException(thrown);
          } else {
            arg = thrown;
          }
        }
      }
    }

    generator.next = invoke.bind(generator, "next");
    generator["throw"] = invoke.bind(generator, "throw");
    generator["return"] = invoke.bind(generator, "return");

    return generator;
  }

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(triple) {
    var entry = { tryLoc: triple[0] };

    if (1 in triple) {
      entry.catchLoc = triple[1];
    }

    if (2 in triple) {
      entry.finallyLoc = triple[2];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry, i) {
    var record = entry.completion || {};
    record.type = i === 0 ? "normal" : "return";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryList.forEach(pushTryEntry, this);
    this.reset();
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1;

        function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        }

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function() {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      // Pre-initialize at least 20 temporary variables to enable hidden
      // class optimizations for simple generators.
      for (var tempIndex = 0, tempName;
           hasOwn.call(this, tempName = "t" + tempIndex) || tempIndex < 20;
           ++tempIndex) {
        this[tempName] = null;
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    _findFinallyEntry: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") && (
              (entry.finallyLoc === finallyLoc || this.prev < entry.finallyLoc))) {
          return entry;
        }
      }
    },

    abrupt: function(type, arg) {
      var entry = this._findFinallyEntry();
      var record = entry ? entry.completion : {};

      record.type = type;
      record.arg = arg;

      if (entry) {
        this.next = entry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      var entry = this._findFinallyEntry(finallyLoc);
      return this.complete(entry.completion);
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry, i);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})();
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