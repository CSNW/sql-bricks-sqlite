# SQLite dialect SQLBricks

Use:

```javascript
// in node:
var sql = require('sql-bricks-sqlite');
// in the browser:
var sql = SQLiteBricks;

var statement = sql.select().from('users').where({name: 'Fred Flintstone'});
```

Adds `limit()`, `offset()`, `orReplace()`, `orAbort()`, etc, to the core SQLBricks library. See http://csnw.github.io/sql-bricks for more information.