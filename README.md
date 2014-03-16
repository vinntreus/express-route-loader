express-route-loader
============

Loads expressjs routes from a specified folder. The key benefit to this
is that you don't have to define each and every route in eg. app.js. Just tell expressjs to load all routes and when adding a new file in your routes
directory it will get automatically loaded (next time you start node).

Install by running:
```
npm install express-route-loader --save
```

Default loads all *.js files in the /routes/ directory (and child directories).

When loading, pass in all dependencies needed for your routes

Usage:
```
var express = require('express'),
    app = express(),
    db = require("some-cool-db")
    routeLoader = require('express-route-loader');

routeLoader.load(app, db);
```

This require your routes to look something like this:
```
module.exports = function(app, db){
  app.get('/users', function(req, res){
    res.send(200, db.getUsers());
  });
};
```

To display routes found and loaded:
```
routeLoader.enableLogging(); //call this before load
routeLoader.load(app, db);
```

If you don't like using the /routes/ directory, go a head and call:
```
routeLoader.injectRoutes(path [, dependencies]);
```

If you just want to require all *.js files in a directory and handle
dependencies your self:
```
// returns object where each filename (without js-extension) is the key
// and the value is the required function
var requiredFiles = routeLoader.requireAllIn(path);
```