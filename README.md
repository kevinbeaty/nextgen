## Nextgen
[![Build Status](https://secure.travis-ci.org/kevinbeaty/nextgen.svg)](http://travis-ci.org/kevinbeaty/nextgen)

Create chains of composable ES6 Generators.

Requires support for ES6 generators.  If using Node.js run with `node --harmony` and version 0.11 or better.

### Transducers
This library is essentially an experimental implementation of transducers using ES6 generators and iterators. If you are not familiar with transducers, check out [Transducers Explained][1].

Generator transducers are created by composing functions that accept a next generator and return a 0-arity function that creates a new generator. Each transformation accepts a next generator transformer to send optionally transformed arguments. The composed generator function accepts an appending terminal generator to accept and potentially aggregate the transformed items. If implementing new generators, it is convenient to use `dispatch` to create generator transducers from generator functions.

The object sent and returned by all composed generators are defined in terms of iteration objects with `{done: boolean, value: value}`.   A transducer reduction can be signaled by sending `{done: true}` to the next generator.

Relationship to transducers:

- 0-arity init: Use initialization of generator before first `yield`
- 2-arity step: Yield each item from the generator in a loop, send transformed arguments as iteration arguments to next generator. Break on `{done: true}` from either iteration yield or result of sending `next` to next generator.
- 1-arity result: Perform action outside of generator loop if iteration is done, but next generator is still accepting values.

The result accumulator is hidden as state within the final appending transformer.  The generator transducers carry more state than transducers based on reducing functions. This allows containing state within the final generator.  Note, that this could prevent some applications of transducers in stateless contexts.

More examples to come. For now, check out the source and tests for definition and use.


### API

```javascript
// iteration
iterate: function(xf, f, coll);
toArray: function(xf?, coll);

// util
compose: function(/*fns*/);
init: function(gen);
dispatch: function(gen); 

// appending generators
genArray: function();

// generator transducers
map: function(mappingFunction);
filter: function(predicate);
remove: function(predicate);
take: function(n);
takeWhile: function(predicate);
drop: function(n);
dropWhile: function(predicate);
cat: transducer
mapcat: function(f);
partitionAll: function(n);
partitionBy: function(f);
```

##### iterate(xf, f, coll)
Iterates over a collection transforming with generator transducer `xf` and sending to appending generator `f`.

##### toArray(xf, coll)
Iterate a collection into an array with an optional transformation. Same as using `iterate` with `genArray` as `f`.

##### genArray()
An appending generator for iterating into arrays. Use as `f` in `iterate`.

##### init(gen)
Initializes a generator by calling generator function with no args and sending first `next`.

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
