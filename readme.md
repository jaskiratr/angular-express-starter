# Quick Start: Angular + Express

This application will run express server and also serve static pages to client using Angular2. It will also build the .js files from typescript while running the server.

- Use [npm express-generator](https://www.npmjs.com/package/express-generator) to create an empty Nodejs + Express Example
- Remove `Views` folder and create a `Client` folder
- Modify `app.js`

  ```
  app.use(express.static(path.join(__dirname, 'client')));
  ```

- Go to `Client` folder and install [Angular2 QuickStart Example](https://github.com/angular/quickstart)

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
