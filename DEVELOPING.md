## Building package

Execute following command from the root folder to build the library. This creates a package in `dist/imagekitio-react.js` folder.
```sh
# run `npm install` for first time
npm run build
```

## Running test cases

The designated directory for tests is `/src/test` folder. All tests will be run against the assertion present in the `/src/test/__snapshot__` folder. To create this file you need to just run below command just once. Any update in the tests can be updated to by pressing `u` while the test environment is running.

Execute following command from the root folder to start testing.
```sh
npm run test
```

## Running sample react app

Please refer to the sample app `Readme.md` for details.
Before sample apps can be used, `imagekitio-react` library needs to be packed and installed using the file system within the sample apps. Use the following steps to run any sample app.

1. In the root folder, install dependencies with `npm install`
2. Build library with `npm run build`
4. Go to `samples/sample-app` folder.
6. Configure sample app with required keys. Use sample-app's `Readme.md` for exact details.
7. Use `npm run start` from the `samples/sample-app` folder this will install the dependencies alongside our library and run our sample-app.

## Running sample backend server

Sample server for upload implementation is available at `samples/sample-app/server`. To run the server, follow these steps

1. Create a `.env` file based on `sample.env` and enter your private key.
2. Use `npm install` to install dependencies. 
3. Use `npm run server` to start the server. It will expose the [authentication endpoint](https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload#how-to-implement-authenticationendpoint-endpoint) on `http://localhost:3000/auth`
