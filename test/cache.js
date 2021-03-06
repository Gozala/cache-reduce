"use strict";

var test = require("reducers/test/util/test")
var lazy = require("reducers/test/util/lazy")

var concat = require("reducers/concat")
var into = require("reducers/into")
var delay = require("reducers/delay")
var end = require("reducible/end")

var when = require("eventual/when")

var cache = require("../cache")


exports["test cache reads once"] = function(assert) {
  var called = 0
  var source = concat(lazy(function() {
                        called = called + 1
                        return 0
                      }),
                      [1, 2, 3])

  var c = cache(source)

  assert.equal(0, called, "cache is lazy")
  assert.deepEqual(into(c), [ 0, 1, 2, 3 ], "values are dispatched")
  assert.deepEqual(into(c), [ 0, 1, 2, 3 ], "second reduce is same")
  assert.equal(1, called, "source was cached")
}

exports["test async cache"] = test(function(assert) {
  var source = delay([1, 2, 3])
  var c = cache(source)

  assert(c, [1, 2, 3], "async streams are cached ok")
})

exports["test async cache reads sync"] = function(assert, done) {
  var source = delay([1, 2, 3])
  var c = cache(source)

  when(into(c), function(actual) {
    assert.deepEqual(actual, [1, 2, 3], "async reads ")
    assert.deepEqual(into(c), [1, 2, 3], "read from cache is sync")
    done()
  })
}

if (require.main === module)
  require("test").run(exports)
