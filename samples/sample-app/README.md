This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

We will assume you are in the directory `samples\sample-app` while following the further instructions 

## Installation

Run the following commands from your shell.

### Getting the SDK ready 

We will first go to the root,
```js
cd ../../
```
Install the node modules,
```js
npm install
```
Create the dist and lib:
```js
npm run build
```

### Installing the sample-app

Now,
Go to `sample-app`,
```bash
cd samples/sample-app
```

then,
```bash
npm install
```

This should create a copy of `imagekitio-react` library in `node_modules` of `sample-app`

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
