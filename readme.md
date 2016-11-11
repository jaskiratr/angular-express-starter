# Quick Start: Angular + Express

- Use [npm express-generator](https://www.npmjs.com/package/express-generator) to create an empty Nodejs + Express Example
- Rename `Views` folder to `Client`
- Modify `app.js`
  ```
    ...
    app.use(express.static(path.join(__dirname, 'client')));
    ...
  ```
- Go to `Client` folder and install [Angular2 QuickStart Example](https://github.com/angular/quickstart)
- Run 'npm install' in both, Root and Client directory.
- In Client directory, run `npm run tsc` to compile typescript.
- Run `npm start` to start the express server
