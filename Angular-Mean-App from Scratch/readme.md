# Creating a MEAN App from scratch
*Credits: Brad Traversy (https://www.youtube.com/watch?v=PFP0oXNNveg)*

The following steps follow the tutorial. There maybe a couple of small changes.

### Setting up Express

`npm init`
Walk through the process. Enter 'server.js' as the entrypoint.

Install packages
`npm install express body-parser ejs mongojs --save`

Create server.js
```
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var tasks = require('./routes/tasks');

var port = 3000;

var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set Static folder for Angular2
app.use(express.static(path.join(__dirname, 'client')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/', index);
app.use('/api', tasks);

app.listen(port, function() {
  console.log('Server started at port ' + port);
});
```
Create a 'routes' folder in root dir and index.js and tasks.js in it.

index.js
```
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('INDEX PAGE');
});

module.exports = router;
```
tasks.js
```
var express = require('express');
var router = express.Router();

router.get('/tasks', function(req, res, next) {
  res.send('TASK API');
});

module.exports = router;
```

Create 'views' folder in root and create index.html in it.
```
<!DOCTYPE html>
<html>

<head>
  <title>mytasklist</title>
</head>

<body>
<h1>Hello World</h1>
</body>

</html>
```

### Setting up Mongodb on MLab

Create a free sandbox database on MLab https://mlab.com/
In MLab, go to your database and add a user
Go to Collections and create a new one 'tasks'
Add a new document in that collection.
```
{
    "title" : "walk the dog",
    "isDone" : false
}
```

Back in 'tasks.js' create CRUD functions that will be later used by Angular2
```
var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');
var db = mongojs('mongodb://jess:jess@ds151917.mlab.com:51917/mytasklist');

//Get All Tasks
router.get('/tasks', function(req, res, next) {
  db.tasks.find(function(err, tasks) {
    if (err) {
      res.send(err);
    }
    res.json(tasks);
  });
});

//Get Single Task
router.get('/task/:id', function(req, res, next) {
  db.tasks.findOne({
    _id: mongojs.ObjectId(req.params.id)
  }, function(err, task) {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
});

//Save task
router.post('/task', function(req, res, next) {
  var task = req.body;
  if (!task.title || !(task.isDone + '')) {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    db.tasks.save(task, function(err, task) {
      if (err) {
        res.send(err);
      }
      res.json(task);
    })
  }
});

//Delete task
router.delete('/task/:id', function(req, res, next) {
  db.tasks.remove({
    _id: mongojs.ObjectId(req.params.id)
  }, function(err, task) {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
});

//Update task
router.put('/task/:id', function(req, res, next) {
  var task = req.body;
  var updTask = {};

  if (task.isDone) {
    updTask.isDone = task.isDone;
  }
  if (task.title) {
    updTask.title = task.title;
  }

  if (!updTask) {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    db.tasks.update({
      _id: mongojs.ObjectId(req.params.id)
    }, updTask, function(err, task) {
      if (err) {
        res.send(err);
      }
      res.json(task);
    });
  }
});

module.exports = router;

```

### Angular2 setup

Create a client folder in the root.
According to documentation on Angular.io, create 3 config files in /client.

package.json
```
{
  "name": "angular-quickstart",
  "version": "1.0.0",
  "scripts": {
    "start": "tsc && concurrently \"tsc -w\" \"lite-server\" ",
    "lite": "lite-server",
    "tsc": "tsc",
    "tsc:w": "tsc -w"
  },
  "licenses": [
    {
      "type": "MIT",
      "url": "https://github.com/angular/angular.io/blob/master/LICENSE"
    }
  ],
  "dependencies": {
    "@angular/common": "~2.1.1",
    "@angular/compiler": "~2.1.1",
    "@angular/core": "~2.1.1",
    "@angular/forms": "~2.1.1",
    "@angular/http": "~2.1.1",
    "@angular/platform-browser": "~2.1.1",
    "@angular/platform-browser-dynamic": "~2.1.1",
    "@angular/router": "~3.1.1",
    "@angular/upgrade": "~2.1.1",
    "angular-in-memory-web-api": "~0.1.13",
    "core-js": "^2.4.1",
    "reflect-metadata": "^0.1.8",
    "rxjs": "5.0.0-beta.12",
    "systemjs": "0.19.39",
    "zone.js": "^0.6.25"
  },
  "devDependencies": {
    "@types/core-js": "^0.9.34",
    "@types/node": "^6.0.45",
    "concurrently": "^3.0.0",
    "lite-server": "^2.2.2",
    "typescript": "^2.0.3"
  }
}

```

tsconfig.json
```
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "moduleResolution": "node",
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "removeComments": false,
    "noImplicitAny": false
  }
}

```

systemjs.config.js
```
/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',
      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',
      // other libraries
      'rxjs':                      'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      }
    }
  });
})(this);

```
Run `npm install` from within the /client folder

In /client create an 'app' folder
Create a new file `app.module.ts` in /client/app/

```
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports:      [ BrowserModule ]
})
export class AppModule { }
```

Create a new file `app.component.ts` in /client/app/

```
import { Component } from '@angular/core';
@Component({
  selector: 'my-app',
  template: '<h1>Hello Angular!</h1>'
})
export class AppComponent { }

```

Import the component in `app.module.ts`

```
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';

@NgModule({
    imports: [BrowserModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }

```

Create `client/app/main.ts` file

```
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);

```

Edit `views/index.html` file

```
<html>
  <head>
    <title>Angular QuickStart</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="styles.css">
    <!-- 1. Load libraries -->
     <!-- Polyfill for older browsers -->
    <script src="node_modules/core-js/client/shim.min.js"></script>
    <script src="node_modules/zone.js/dist/zone.js"></script>
    <script src="node_modules/reflect-metadata/Reflect.js"></script>
    <script src="node_modules/systemjs/dist/system.src.js"></script>
    <!-- 2. Configure SystemJS -->
    <script src="systemjs.config.js"></script>
    <script>
      System.import('app').catch(function(err){ console.error(err); });
    </script>
  </head>
  <!-- 3. Display the application -->
  <body>
    <my-app>Loading...</my-app>
  </body>
</html>

```

Create empty file `/client/styles.css`
Go to /client and run `npm start` from a new shell

Go to `localhost:3000` in your browser to verify there are no errors in console.

### Install Twitter Bootstrap CSS

Install bower
`npm install -g bower`

Create `.bowerrc`file in root
```
{
  "directory": "client/bower_components"
}
```

Run the following in shell from root directory
```
bower init
bower install bootstrap --save
```

Add bootstrap to `client/index.html`


### UI

Create `client\app\components\tasks` folder
Create `tasks.component.js` and `tasks.component.html` in it

tasks.components.ts
```
import { Component } from '@angular/core';
@Component({
  moduleId: module.id, #For using relative path
  selector: 'tasks',
  templateUrl: 'tasks.component.html' # Relative path
})
export class TasksComponent { }

```

tasks.component.html
```
TASKS
```

Import TasksComponent to `app.module.ts`

app.module.ts
```
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { TasksComponent } from './components/tasks/tasks.component';

@NgModule({
    imports: [BrowserModule],
    declarations: [AppComponent, TasksComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }

```

Modify template in `app.component.ts`
`template: '<tasks></tasks>'`

Check `localhost:3000` and you should see "TASKS"

Modify `app.component.ts`
```
import { Component } from '@angular/core';
@Component({
  moduleId : module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html'
})
export class AppComponent { }

```

Create `app.component.html`
```
<form class="well">
  <div class="form-group">
    <input type="text" class = "form-control" placeholder="Add Task...">
  </div>
</form>

<div class = "task-list">
  <div class="col-md-1">
    <input type="checkbox" />
  </div>
  <div class="col-md-7">
    Some Task
  </div>
  <div class="col-md-4">
    <input type="button" value="Delete" class="btn btn-danger" />
  </div>
</div>

```


Create `app/services/task.service.ts`
```
import{Injectable} from '@angular/core';
import{Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TaskService {
  constructor(private http:Http){
    console.log("Task service initialized");
  }
}
```

Modify `app.component.ts` to add taskService
```
import { Component } from '@angular/core';
import {TaskService} from './services/task.service';

@Component({
  moduleId : module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  providers: [TaskService]
})
export class AppComponent { }
```

Add Http Module to `app.module.ts`
```
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent }   from './app.component';
import { TasksComponent } from './components/tasks/tasks.component';

@NgModule({
    imports: [BrowserModule, HttpModule],
    declarations: [AppComponent, TasksComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }

```

Import TaskService in `tasks.component.ts`
```
import { Component } from '@angular/core';
import {TaskService} from '../../services/task.service';
@Component({
    moduleId: module.id,
    selector: 'tasks',
    templateUrl: 'tasks.component.html'
})
export class TasksComponent {
  constructor(private taskService: TaskService){

  }
}
```

You should see "Task service initialized..." in browser console

`task.service.ts`
```
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TaskService {
  constructor(private http: Http) {
    console.log("Task service initialized");
  }

  getTasks() {
    return this.http.get('http://localhost:3000/api/tasks')
      .map(res => res.json());
  }
}
```

Create `client/task.ts` file  as a model
```
export class Task{
  _id : String; // Mongodb ObjectId
  title : String;
  isDone : boolean;
}
```

`tasks.component.ts`
```
import { Component } from '@angular/core';
import {TaskService} from '../../services/task.service';
import {Task} from '../../../Task';

@Component({
  moduleId: module.id,
  selector: 'tasks',
  templateUrl: 'tasks.component.html'
})
export class TasksComponent {
  tasks: Task[ ];

  constructor(private taskService: TaskService) {
    this.taskService.getTasks()
    .subscribe( tasks => {
      this.tasks = tasks; // Gives access in task.component.html file
    });
  }
}
```

Populate `tasks.component.html`
```
<form class="well">
  <div class="form-group">
    <input type="text" class="form-control" placeholder="Add Task...">
  </div>
</form>

<div class="task-list">
  <div *ngFor="let task of tasks">
    <div class="col-md-1">
      <input type="checkbox" />
    </div>
    <div class="col-md-7">
      {{task.title}}
    </div>
    <div class="col-md-4">
      <input type="button" value="Delete" class="btn btn-danger" />
    </div>
  </div>
</div>

```

Add Forms Module in `app.module.ts`
```
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import {FormsModule} from '@angular/forms';
import { AppComponent }   from './app.component';
import { TasksComponent } from './components/tasks/tasks.component';

@NgModule({
  imports: [BrowserModule, HttpModule, FormsModule],
  declarations: [AppComponent, TasksComponent],
  bootstrap: [AppComponent]
})

export class AppModule { }
```

To add task modify form in `tasks.component.html`
```
<form class="well" (submit) = "addTask($event)">
  <div class="form-group">
    <input type="text" [(ngModel)]="title" name= "title" class="form-control" placeholder="Add Task...">
  </div>
</form>

<div class="task-list">
  <div *ngFor="let task of tasks">
    <div class="col-md-1">
      <input type="checkbox" />
    </div>
    <div class="col-md-7">
      {{task.title}}
    </div>
    <div class="col-md-4">
      <input type="button" value="Delete" class="btn btn-danger" />
    </div>
  </div>
</div>
```

Create addTask Service in `task.service.ts`
```
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TaskService {
  constructor(private http: Http) {
    console.log("Task service initialized");
  }

  getTasks() {
    return this.http.get('http://localhost:3000/api/tasks')
      .map(res => res.json());
  }

  addTask(newTask){
    var headers = new headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/api/task',JSON.stringify(newTask),{headers:headers})
    .map(res=> res.json);
  }
}
```

`task.component.ts`
```
import { Component } from '@angular/core';
import {TaskService} from '../../services/task.service';
import {Task} from '../../../Task';

@Component({
  moduleId: module.id,
  selector: 'tasks',
  templateUrl: 'tasks.component.html'
})
export class TasksComponent {
  tasks: Task[ ]; //task.ts
  title: string;

  constructor(private taskService: TaskService) {
    this.taskService.getTasks()
    .subscribe( tasks => {
      this.tasks = tasks;
      console.log(tasks);
    });
  }

  addTask(event){
    event.preventDefault();
    var newTask = {
      title: this.title,
      isDone : false
    }

    this.taskService.addTask(newTask)
    .subscribe(task => {
      this.tasks.push(task);
      this.title= '' ;
    });

  }
}
```

For delete task modify `tasks.component.html`
```
<form class="well" (submit) = "addTask($event)">
  <div class="form-group">
    <input type="text" [(ngModel)]="title" name= "title" class="form-control" placeholder="Add Task...">
  </div>
</form>

<div class="task-list">
  <div *ngFor="let task of tasks">
    <div class="col-md-1">
      <input type="checkbox" />
    </div>
    <div class="col-md-7">
      {{task.title}}
    </div>
    <div class="col-md-4">
      <input type="button" (click)="deleteTask(task._id)" value="Delete" class="btn btn-danger" />
    </div>
    <br /><br />
  </div>
</div>
```
`task.component.ts`
```
import { Component } from '@angular/core';
import {TaskService} from '../../services/task.service';
import {Task} from '../../../Task';

@Component({
  moduleId: module.id,
  selector: 'tasks',
  templateUrl: 'tasks.component.html'
})
export class TasksComponent {
  tasks: Task[]; //task.ts
  title: string;

  constructor(private taskService: TaskService) {
    this.taskService.getTasks()
      .subscribe(tasks => {
        this.tasks = tasks;
        console.log(tasks);
      });
  }

  addTask(event) {
    event.preventDefault();
    var newTask = {
      title: this.title,
      isDone: false
    }

    this.taskService.addTask(newTask)
      .subscribe(task => {
        this.tasks.push(task);
        this.title = '';
      });

  }

  deleteTask(id) {
    var tasks = this.tasks;
    this.taskService.deleteTask(id)
      .subscribe(data => {
        if (data.n == 1) {
          for (var i = 0; i < tasks.length; i++) {
            if (tasks[i]._id == id) {
              tasks.splice(i, 1);
            }
          }
        }
      });
  }
}
```

`task.service.ts`
```
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TaskService {
  constructor(private http: Http) {
    console.log("Task service initialized");
  }

  getTasks() {
    return this.http.get('http://localhost:3000/api/tasks')
      .map(res => res.json());
  }

  addTask(newTask) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/api/task', JSON.stringify(newTask), { headers: headers })
      .map(res => res.json());
  }

  deleteTask(id){
    return this.http.delete('/api/task/'+id)
    .map(res => res.json());
  }

}

```

Update check boxes for completed tasks
`tasks.component.html`
```
<form class="well" (submit) = "addTask($event)">
  <div class="form-group">
    <input type="text" [(ngModel)]="title" name= "title" class="form-control" placeholder="Add Task...">
  </div>
</form>

<div class="task-list">
  <div *ngFor="let task of tasks">
    <div class="col-md-1">
      <input type="checkbox" [checked]="task.isDone" (click)="updateStatus(task)"/>
    </div>
    <div class="col-md-7">
      {{task.title}}
    </div>
    <div class="col-md-4">
      <input type="button" (click)="deleteTask(task._id)" value="Delete" class="btn btn-danger" />
    </div>
    <br /><br />
  </div>
</div>

```
`tasks.component.ts`
```
import { Component } from '@angular/core';
import {TaskService} from '../../services/task.service';
import {Task} from '../../../Task';

@Component({
  moduleId: module.id,
  selector: 'tasks',
  templateUrl: 'tasks.component.html'
})
export class TasksComponent {
  tasks: Task[]; //task.ts
  title: string;

  constructor(private taskService: TaskService) {
    this.taskService.getTasks()
      .subscribe(tasks => {
        this.tasks = tasks;
        console.log(tasks);
      });
  }

  addTask(event) {
    event.preventDefault();
    var newTask = {
      title: this.title,
      isDone: false
    }

    this.taskService.addTask(newTask)
      .subscribe(task => {
        this.tasks.push(task);
        this.title = '';
      });

  }

  deleteTask(id) {
    var tasks = this.tasks;
    this.taskService.deleteTask(id)
      .subscribe(data => {
        if (data.n == 1) {
          for (var i = 0; i < tasks.length; i++) {
            if (tasks[i]._id == id) {
              tasks.splice(i, 1);
            }
          }
        }
      });
  }

  updateStatus(task){
    var _task = {
      _id :task._id,
      title: task.title,
      isDone: !task.isDone
    };

    this.taskService.updateStatus(_task).subscribe(data => {
      task.isDone = !task.isDone;
    });

  }
}

```

`tasks.service.ts`
```
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TaskService {
  constructor(private http: Http) {
    console.log("Task service initialized");
  }

  getTasks() {
    return this.http.get('http://localhost:3000/api/tasks')
      .map(res => res.json());
  }

  addTask(newTask) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/api/task', JSON.stringify(newTask), { headers: headers })
      .map(res => res.json());
  }

  deleteTask(id){
    return this.http.delete('/api/task/'+id)
    .map(res => res.json());
  }

  updateStatus(task){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:3000/api/task/'+task._id, JSON.stringify(task), { headers: headers })
      .map(res => res.json());
  }

}
```


To Learn

- Angular2 Routing
- Angular2 Directives
- SocketIO integration
