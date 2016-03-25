## Backend (API)
The backend is written in Nodejs and works with a MongoDB database. The source code is inside `backend` folder.

### Install dependencies
    * Node.js (http://nodejs.org)
    * MongoDB Server

To install the modules used by the backend execute:
```
cd backend
npm install
```

### Setup database
The database connection parameters are in the file `backend/src/configuration/database.js`.

### Run test
Go to `backend` folder, and there you have to execute `npm test` for unit tests.

### Start backend server
In the `backend` folder execute the command `npm start`. The API will be available on http://localhost:8080/

## Frontend (Web app)
The frontend is written in Javascript using AngularJS. The source code is inside `frontend` folder.

### Install dependencies
To install all the dependecies used by the frontend execute:
```
npm install gulp -g
npm install bower -g
cd frontend
npm install
bower install
```

### Run test
Go to `frontend` folder, and there you have to execute `gulp tdd` for unit tests.

### Start frontend app
In the `frontend` folder execute the command `gulp server`. The application will be available on http://localhost:8082/


### Online version of the demo project
The URL of the demo project is http://demo.mindaft.com/

Actually, there are three users created

    * username: 'admin', password: 'admin'
    * username: 'manager', password: 'manager'
    * username: 'regular', password: 'regular'

One user for each role.
