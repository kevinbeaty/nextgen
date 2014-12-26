"use strict";
var ng = require('../'),
    test = require('tape'),
    slice = Array.prototype.slice;

function plus(x){
  return function(y){
    return x+y;
  };
}

function isOdd(x){
  return x % 2 === 1;
}

function reverse(arr){
  return arr.reverse();
}

function identity(x){return x;}

test('genArray manual', function(t){
  var gen = ng.init(ng.genArray()), next;
  next = gen.next({done: false, value: 0});
  t.strictEqual(false, next.done);
  next = gen.next({done: false, value: 1});
  t.strictEqual(false, next.done);
  next = gen.next({done: false, value: 2});
  t.strictEqual(false, next.done);
  next = gen.next({done: true});
  t.strictEqual(true, next.done);
  t.deepEqual([0, 1, 2], next.value);
  t.end();
});

test('map', function(t){
  var gen = ng.map(plus(1));
  t.deepEqual(ng.iterate(gen, ng.genArray, [0, 1, 2]), [1, 2, 3]);
  t.deepEqual(ng.toArray(gen, [0, 1, 2]), [1, 2, 3]);

  gen = ng.compose(ng.map(plus(1)), ng.map(plus(2)));
  t.deepEqual(ng.iterate(gen, ng.genArray, [0, 1, 2]), [3, 4, 5]);
  t.deepEqual(ng.toArray(gen, [0, 1, 2]), [3, 4, 5]);
  gen = ng.compose(ng.map(plus(1)), ng.map(plus(2)), ng.map(plus(3)));
  t.deepEqual(ng.iterate(gen, ng.genArray, [0, 1, 2]), [6, 7, 8]);
  t.deepEqual(ng.toArray(gen, [0, 1, 2]), [6, 7, 8]);

  gen = ng.compose(ng.map(plus(1)), ng.compose(ng.map(plus(2)), ng.map(plus(3))));
  t.deepEqual(ng.iterate(gen, ng.genArray, [0, 1, 2]), [6, 7, 8]);
  t.deepEqual(ng.toArray(gen, [0, 1, 2]), [6, 7, 8]);
  t.deepEqual(ng.toArray(ng.compose(gen, ng.take(3)), [0, 1, 2, 3, 4]), [6, 7, 8]);
  t.end();
});

test('filter', function(t){
  var gen = ng.filter(isOdd);
  t.deepEqual(ng.toArray(gen, [0, 1, 2, 3]), [1, 3]);
  t.deepEqual(ng.toArray(gen, [0, 1, 2, 3, 4]), [1, 3]);
  gen = ng.compose(ng.map(plus(1)), ng.filter(isOdd));
  t.deepEqual(ng.toArray(gen, [0, 1, 2]), [1, 3]);
  gen = ng.compose(ng.map(plus(1)), ng.filter(isOdd), ng.map(plus(3)));
  t.deepEqual(ng.toArray(gen, [0, 1, 2]), [4, 6]);
  t.end();
});

test('remove', function(t){
  var gen = ng.remove(isOdd);
  t.deepEqual(ng.toArray(gen, [0, 1, 2, 3]), [0, 2]);
  t.deepEqual(ng.toArray(gen, [0, 1, 2, 3, 4]), [0, 2, 4]);
  gen = ng.compose(ng.map(plus(1)), ng.remove(isOdd));
  t.deepEqual(ng.toArray(gen, [0, 1, 2]), [2]);
  gen = ng.compose(ng.map(plus(1)), ng.remove(isOdd), ng.map(plus(3)));
  t.deepEqual(ng.toArray(gen, [0, 1, 2]), [5]);
  t.end();
});

test('take', function(t){
  var gen = ng.take(3);
  t.deepEqual(ng.toArray(gen, [0, 1, 2, 3]), [0, 1, 2]);
  t.deepEqual(ng.toArray(gen, [0, 1, 2]), [0, 1, 2]);
  t.deepEqual(ng.toArray(gen, [0, 1]), [0, 1]);
  t.deepEqual(ng.toArray(gen, [0]), [0]);
  t.deepEqual(ng.toArray(gen, []), []);
  t.end();
});

test('takeWhile', function(t){
  var gen = ng.takeWhile(isOdd);
  t.deepEqual(ng.toArray(gen, [1, 3, 5, 2, 3]), [1, 3, 5]);
  t.deepEqual(ng.toArray(gen, [1, 3, 5]), [1, 3, 5]);
  t.deepEqual(ng.toArray(gen, [0, 1, 3, 5]), []);
  t.end();
});

test('drop', function(t){
  var gen = ng.drop(3);
  t.deepEqual(ng.toArray(gen, [0, 1, 2, 3, 4]), [3, 4]);
  t.deepEqual(ng.toArray(gen, [0, 1, 2, 3]), [3]);
  t.deepEqual(ng.toArray(gen, [0, 1, 2]), []);
  t.deepEqual(ng.toArray(gen, [0, 1]), []);
  t.deepEqual(ng.toArray(gen, [0]), []);
  t.deepEqual(ng.toArray(gen, []), []);
  t.end();
});

test('dropWhile', function(t){
  var gen = ng.dropWhile(isOdd);
  t.deepEqual(ng.toArray(gen, [1, 3, 5, 2, 3]), [2, 3]);
  t.deepEqual(ng.toArray(gen, [1, 3, 5]), []);
  t.deepEqual(ng.toArray(gen, [0, 1, 3, 5]), [0, 1, 3, 5]);
  t.end();
});

test('cat', function(t){
  var gen = ng.cat;
  t.deepEqual(ng.toArray(gen, [[0], [], [1, 2], [3]]), [0, 1, 2, 3]);
  gen = ng.compose(ng.cat, ng.take(2));
  t.deepEqual(ng.toArray(gen, [[0], [1, 2], [3]]), [0, 1]);
  gen = ng.compose(ng.map(reverse), ng.cat);
  t.deepEqual(ng.toArray(gen, [[0, 1], [], [1, 2], [3, 4]]), [1, 0, 2, 1, 4, 3]);
  t.end();
});

test('mapcat', function(t){
  var gen = ng.mapcat(reverse);
  t.deepEqual(ng.toArray(gen, [[0, 1, 2], [], [1, 2], [3]]), [2, 1, 0, 2, 1, 3]);
  gen = ng.compose(ng.mapcat(reverse), ng.take(2));
  t.deepEqual(ng.toArray(gen, [[0], [1, 2], [3]]), [0, 2]);
  t.end();
});

test('partitionAll', function(t) {
  var gen = ng.partitionAll(2);
  var result = ng.toArray(gen, [0,1,2,3,4,5,6,7,8,9]);
  t.deepEqual(result, [[0,1],[2,3],[4,5],[6,7],[8,9]]);
  result = ng.toArray(gen, [0,1,2,3,4,5,6,7,8]);
  t.deepEqual(result, [[0,1],[2,3],[4,5],[6,7],[8]]);
  gen = ng.compose(ng.partitionAll(2), ng.take(2));
  result = ng.toArray(gen, [0,1,2,3,4,5,6,7,8,9]);
  t.deepEqual(result, [[0,1],[2,3]]);
  t.end();
});

test('partitionBy', function(t) {
  var gen = ng.partitionBy(isOdd);
  var result = ng.toArray(gen, [0,1,1,3,4,6,8,7,7,8]);
  t.deepEqual(result, [[0], [1,1,3], [4,6,8], [7,7], [8]]);
  gen = ng.compose(ng.partitionBy(identity), ng.take(2));
  result = ng.toArray(gen, [1,1,1,2,2,3,3,3]);
  t.deepEqual(result, [[1,1,1],[2,2]]);
  t.end();
});

test('compose manual iterate', function(t){
  var nextGen = ng.compose(ng.map(plus(1)), ng.filter(isOdd), ng.map(plus(3)), ng.take(3));
  var gen = ng.init(nextGen(ng.genArray()));
  var next = gen.next({done: false, value: 0});
  t.strictEqual(false, next.done);
  next = gen.next({done: false, value: 1});
  t.strictEqual(false, next.done);
  next = gen.next({done: false, value: 2});
  t.strictEqual(false, next.done);
  next = gen.next({done: false, value: 3});
  t.strictEqual(false, next.done);
  next = gen.next({done: false, value: 4});
  t.strictEqual(true, next.done);
  t.deepEqual([4, 6, 8], next.value);
  t.end();
});
