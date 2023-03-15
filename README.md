# Todo list using react, python and fastAPI

## THe following applications will be necessary to execute that project.

- Python3
- npm
- MongoDB

## How to set the environment

- Clone the repository
- Execute the batch file `startPythonEnvironment.bat` on the root folder of the project. That file will create a virtual environment for python, activate that environment and install all dependencies of our project.
- Inside the folder frontend, which has our react files, execute the command `npm install`. That command will install all dependencies of our frontend in react.

## Starting the servers

- Once you have all dependencies installed you'll be able to start the python server and react server.
- With virtual environment activated, inside the folder `backend\app`, execute the command below to start our python server at default address `localhost:8000`. It's important verify if the virtual environment is activated.

`python app.py`

- After that, inside frontend folder, execute the command below to start our react server at default address `localhost:3000`.

`npm start`

- Now at the address `localhost:3000`, we'll be able to see our application in execution.
