This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

We will assume you are in the directory `samples\sample-app` while following the further instructions 

## Installation

Run the following commands from your shell.

### Installing the sample-app

Inside `sample-app`, run
```bash
npm install
```

## Setting the enviroment variable

Create a .env file by renaming the sample.env in `samples/sample-app`

Fill is the required parameters according to your imagekit account.

## Starting the frontend sample app

Finally run the app,
```bash
npm start
```
To run the upload component you also will have set up a backend server

## Setting up the sample backend server

There is a sample server present in the sample app directory in server directory.

It takes the `private key` from .env file, so create a .env file by renaming the sample.env in `samples/sample-app/server`

 To run this server, go to server directory `cd server`, then run:

```bash
npm install # for first time
npm run server
```
