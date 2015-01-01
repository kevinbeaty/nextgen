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
