## Nextgen
[![Build Status](https://secure.travis-ci.org/kevinbeaty/nextgen.svg)](http://travis-ci.org/kevinbeaty/nextgen)

Create chains of composable ES6 Generators.

Requires support for ES6 generators.  If using Node.js run with `node --harmony` and version 0.11 or better.

Example:

```javascript
var ng = require('nextgen')
var nextGen = ng.compose(
      ng.map(plus(1)),
      ng.filter(isOdd),
      ng.map(plus(3)),
      ng.take(3))
  var arr = ng.toArray(nextGen, [0, 1, 2, 3, 4])
  t.deepEqual(arr, [4, 6, 8]);
```

Which is just sugar for:

```javascript
var ng = require('nextgen')
var nextGen = ng.compose(
      ng.map(plus(1)),
      ng.filter(isOdd),
      ng.map(plus(3)),
      ng.take(3))
var gen = nextGen([])
gen.next()

var next = gen.next({done: false, value: 0})
// {done: false, value: [4]}

next = gen.next({done: false, value: 1})
// {done: false, value: [4]}

next = gen.next({done: false, value: 2})
// {done: false, value: [4, 6]}

next = gen.next({done: false, value: 3})
// {done: false, value: [4, 6]}

next = gen.next({done: false, value: 4})
// {done: true, value: [4, 6, 8]}
```

### Implementation
This library is essentially an experimental implementation of transducers using ES6 generators and iterators. If you are not familiar with transducers, check out [Transducers Explained][1].

Generator transducers are created by composing functions that accept a next generator and return a new generator. Each transformation accepts a next generator transformer to send optionally transformed arguments. The composed generator function accepts an appending terminal generator to accept and potentially aggregate the transformed items.  If implementing new generators, it is convenient to use `dispatch` to create generator transducers from generator functions.

 If an array is passed in place of a generator, the results will be concatenated onto the array. If a terminal generator is `undefined`, the results will be concatenated onto an empty array.

The object sent and returned by all composed generators are defined in terms of iteration objects with `{done: boolean, value: value}`.   A transducer reduction can be signaled by sending `{done: true}` to the next generator.

Relationship to transducers:

- 0-arity init: Use initialization of generator before first `yield`.  Call `next` to initialize next generator.
- 2-arity step: Yield each item from the generator in a loop, send transformed arguments as iteration arguments to next generator. Break on `{done: true}` from either iteration yield or result of sending `next` to next generator.
- 1-arity result: Perform action outside of generator loop if iteration is done, but next generator is still accepting values.

The result accumulator is hidden as state within the final appending transformer (which will be internal and generated into an array if not specified).  The generator transducers carry more state than transducers based on reducing functions. This allows containing state within the final generator.  Note, that this could prevent some applications of transducers in stateless contexts.

Examples (from source):

```javascript
function* map(f, gen){
  var next,
      result = gen.next()
  while(!result.done){
    next = yield result.value
    if(!next.done){
      next = {done: false, value: f(next.value)}
    }
    result = gen.next(next)
  }
  return result.value
}

function* filter(p, gen){
  var next,
      result = gen.next()
  while(!result.done){
    next = yield result.value
    if(next.done || p(next.value)){
      result = gen.next(next)
    }
  }
  return result.value
}

function* take(n, gen){
  var i = 0,
      result = gen.next()
  while(!result.done){
    result = gen.next(yield result.value)
    if(!result.done && ++i >= n){
      result = gen.next({done: true})
    }
  }
  return result.value
}

module.exports = {
  map: dispatch(map),
  filter: dispatch(filter),
  take: dispatch(take)
}

```


### API

```javascript
// iteration
iterable: function(nextGen, iter)
toArray: function(nextGen, iter)

// util
compose: function(/*fns*/)
dispatch: function(gen)

// generator transducers
map: function(mappingFunction)
filter: function(predicate)
remove: function(predicate)
take: function(n)
takeWhile: function(predicate)
drop: function(n)
dropWhile: function(predicate)
cat: transducer
mapcat: function(f)
partitionAll: function(n)
partitionBy: function(f)
```

##### iterable(nextGen, iter)
Creates an ES6 iterable that iterates over a collection transforming with generator transducer `nextGen`. The iterator created from the iterable is lazy.

##### toArray(nextGen, iter)
Generates an array from `iterable(nextGen, iter)`

##### dispatch(gen)
Creates a generator transducer by dispatching to a generator function.  The result will be a function that can be called to provide initial arguments to the generator.  The last argument to the generator function will be an initialized next generator to send possibly transformed arguments. This generator will be provided by the library.  Initial arguments provided by calling `dispatched` function.  All generator transducers below are created with `dispatch`. See source and tests for examples usage.

##### compose()
Simple function composition of arguments. Useful for composing (combining) transducers.

### Generator Transducers

##### map(mappingFunction)
Transducer that steps all items after applying a `mappingFunction` to each item.

##### filter(predicate)
Transducer that steps items which pass predicate test.

##### remove(predicate)
Transducer that removes all items that pass predicate.

##### take(n)
Transducer that steps first `n` items and then terminates with `reduced`.

##### takeWhile(predicate)
Transducer that take items until predicate returns true. Terminates with reduce when predicate returns true.

##### drop(n)
Transducer that drops first `n` items and steps remaining untouched.

##### dropWhile(predicate)
Transducer that drops items until predicate returns true and steps remaining untouched.

##### cat
Concatenating transducer.  Reducing over every item in the transformation using provided transformer.

##### mapcat(mappingFunction)
Transducer that applies a `mappingFunction` to each item, then concatenates the result of the mapping function.  Same is `compose(map(mappingFunction), cat)`

##### partitionAll(n)
Partitions the source into arrays of size `n`. When transformer completes, the transformer will be stepped with any remaining items.

##### partitionBy(f)
Partitions the source into sub arrays when the value of the function `f` changes equality.  When transformer completes, the transformer will be stepped with any remaining items.

[1]: http://simplectic.com/blog/2014/transducers-explained-1/
