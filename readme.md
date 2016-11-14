# Setting Up skeleton for MEAN App

I've tried putting together various ways of setting up a basic MEAN stack application. As a new learner, setting it up from scratch is the most helpful. Refer to the readme for in the relevant folder for that method.

It is also much more appropriate to run node server and angular client in separate shells. It becomes easier to obtain relevant error and warnings. 

## Option 1 : Use Express-generator and Angular QuickStart Repository
This application will run express server and also serve static pages to client using Angular2. It will also build the .js files from typescript while running the server.

- Use [npm express-generator](https://www.npmjs.com/package/express-generator) to create an empty Nodejs + Express Example
- Remove `Views` folder and create a `Client` folder
- Modify `app.js`

  ```
  app.use(express.static(path.join(__dirname, 'client')));
  ```

- Go to `Client` folder and clone [Angular2 QuickStart Example](https://github.com/angular/quickstart)

  ```
  cd client
  git clone  https://github.com/angular/quickstart .
  rm -rf .git  # non-Windows
  rd .git /S/Q # windows
  npm run tsc # important to render typescript -> javascript once
  ```

- Run `npm install` in both, root and /client directory.

- Modify scripts section in `package.json` in your root as below:

  ```
  "scripts": {
    "start": "node ./bin/www && concurrently \"npm run client\" ",
    "client": "cd client && npm run start"
  }
  ```

- Run `npm start` to start the express server

- Point your browser to `localhost:3000`

## Option 2 : Using Angular2 Cli instead of Angular QuickStart Repository

Installing angular-cli and running the server

```
npm install -g angular-cli
ng new client
cd client
ng serve
```

Run node server separately in another shell `npm start`

```
"scripts": {
  "start": "node ./bin/www"
}
```

## Option 3 : Use Yeoman

Install Yeoman and generator

```
npm install --global yo
npm install --global generator-ng2-meanstack
```

Create a new folder and initialize an app

```
yo ng2-meanstack
```

---
## Miscellaneous

### Installing SocketIO
Install socketIO for node server
`npm install socket.io --save`

Modify app.js
```
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//...other stuff...

http.listen(8000, function() {
  console.log('Express listening on *:8000');
});

io.on('connection', function(socket) {
  console.log("New socket connection");
});

```

In systemjs.config.js located in `\public`

```
var map = {
  ... Other Stuff ...
  "socket.io-client": 'node_modules/socket.io-client'
};

var packages = {
  ... Other Stuff ...
  "socket.io-client": {
    main: './socket.io.js'
  }

}
```

Go to `\Public` and run the following in shell

```
npm install socket.io-client --save
typings install dt~socket.io-client --save --global
```

In your Component

```
import * as io from "socket.io-client";

export class AppComponent implements OnInit {

    constructor() {
        var socket = io('http://localhost:8000');
        socket.on('connect', function() {
            console.log('connect')
        });
    }

    ngOnInit() {

    }

}
```
