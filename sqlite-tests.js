(function() {
"use strict";

var is_common_js = typeof exports != 'undefined';

var _ = is_common_js ? require('underscore') : window._;
var sql = is_common_js ? require('./sqlite.js') : window.SQLiteBricks;

var assert;
if (is_common_js) {
  assert = require('assert');
}
else {
  assert = function(condition, message) {
    if (!condition)
      throw new Error(message);
  };
  assert.equal = function(actual, expected) {
    if (actual != expected) throw new Error(JSON.stringify(actual) + ' == ' + JSON.stringify(expected));
  };
  assert.deepEqual = function(actual, expected) {
    if (!_.isEqual(actual, expected)) throw new Error(JSON.stringify(actual) + ' == ' + JSON.stringify(expected));
  };
  assert.throws = function(fn) {
    try {
      fn();
    }
    catch(ex) {
      return true;
    }
    throw new Error('The function passed to assert.throws() did not throw');
  }
}

var select = sql.select;
var update = sql.update;
var insert = sql.insert;
describe('SQLite extension for SQLBricks', function() {
  it('should handle UPDATE OR REPLACE', function() {
    assert.equal(update('user').orReplace().set({'name': 'Fred', 'id': 33}).toString(),
      "UPDATE OR REPLACE \"user\" SET name = 'Fred', id = 33");
  });

  it('should handle INSERT OR REPLACE', function() {
    assert.equal(insert().orReplace().into('user').values({'id': 33, 'name': 'Fred'}).toString(),
      "INSERT OR REPLACE INTO \"user\" (id, name) VALUES (33, 'Fred')");
  });
});

describe('LIMIT ... OFFSET', function() {
  describe('.limit()', function() {
    it('should add a LIMIT clause', function() {
      assert.equal(select().from('user').limit(10).toString(),
        'SELECT * FROM "user" LIMIT 10');
    });
  });

  describe('.offset()', function() {
    it('should add an OFFSET clause', function() {
      assert.equal(select().from('user').offset(10).toString(),
        'SELECT * FROM "user" OFFSET 10');
    });
    it('should place OFFSET after LIMIT if both are supplied', function() {
      assert.equal(select().from('user').offset(5).limit(10).toString(),
        'SELECT * FROM "user" LIMIT 10 OFFSET 5');
    });
  });
});

})();