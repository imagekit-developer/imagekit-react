## How it works

This is a simple React router v7 app. In Github CI, we build the SDK and pack it. Then we install it in this test app and run the playwright tests.

We are using snapshot testing to verify the output generate by the SDK. This asserts the whole element along with all attributes instead of tons of assertions for each attribute.

Run the test app and manually verify the output before comming any changes in snapshots.

We are testing both SSR and CSR.