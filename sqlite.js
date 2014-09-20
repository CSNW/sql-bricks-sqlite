// SQLite extension for SQLBricks
(function() {
  if (typeof exports != 'undefined')
    sql = require('sql-bricks');
  else
    sql = window.SqlBricks;

  var Update = sql.update;
  var Insert = sql.insert;
  var Select = sql.select;

  // Insert & Update OR clauses (SQLite dialect)
  Update.defineClause('or', '{{#if _or}}OR {{_or}}{{/if}}', {after: 'update'});
  Insert.defineClause('or', '{{#if _or}}OR {{_or}}{{/if}}', {after: 'insert'});

  var or_methods = {
    'orReplace': 'REPLACE', 'orRollback': 'ROLLBACK',
    'orAbort': 'ABORT', 'orFail': 'FAIL'
  };
  Object.keys(or_methods).forEach(function(method) {
    Insert.prototype[method] = Update.prototype[method] = function() {
      this._or = or_methods[method]; return this;
    };
  });

  // TODO: shouldn't LIMIT/OFFSET use handleValue()? Otherwise isn't it vulnerable to SQL Injection?
  Select.prototype.limit = function(val) {
    this._limit = val;
    return this;
  };
  Select.prototype.offset = function(val) {
    this._offset = val;
    return this;
  };

  Select.defineClause(
    'limit',
    '{{#ifNotNull _limit}}LIMIT {{_limit}}{{/ifNotNull}}',
    {after: 'orderBy'}
  );

  Select.defineClause(
    'offset',
    '{{#ifNotNull _offset}}OFFSET {{_offset}}{{/ifNotNull}}',
    {after: 'limit'}
  );

  if (typeof exports != 'undefined')
    module.exports = sql;
  else
    window.SQLiteBricks = sql;

})();
