## Contributing
When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

## Building package

Execute following command from the root folder to build the library. This will create bundles in `dist` folder.

```sh
npm install # run for first time
npm run build
```

## Running test cases

The designated directory for tests is `/tests/jest` folder. All tests will be run against the assertion present in the `/tests/jest/__snapshot__` folder. To create this file you need to run the following command once. To rerun tests after making changes press`u` while the test environment is running.

Execute following command from the root folder to start testing.
```sh
npm run test
```

## Running the test frontend React app

Please refer to the the test app `README.md` for details.

## Running the test backend server

Please refer to the the test app `README.md` for details.
