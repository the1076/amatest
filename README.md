# Introduction 
An amateur (possibly naive) approach to unit/functional/integration testing library built with vanilla JS.  
Asynchronous testing | WebComponents | async/await | ES6

This is a simplified apparatus for advanced users to do quick "workbench" testing and is not a substitute for a fully-featured testing suite.

# Getting Started
Run the files in the `src` folder. Create any test suites following the example in the test-suites `folder`.

# Notes
- TestSuites must extend the `TestSuite` class.
- All tests must return a `TestResult` instance.
- `TestSuite`s must be exported as default.
- `TestSuite`s must be stored in the test-suites subfolder, if you're loading them from the manifest.
- The manifest supports two formats: "Definition" or "Name".
  - **"Definition"** means setting the classname and filename with the following format: `{ "className": "TestSuite_MyTestSuite", "path": "my-oddly-named-test-suite.js" }`
  - **"Name"** means just using the classname and letting the library parse it. The entry would therefore be `"TestSuite_MyTestSuite"`. The library would then expect a file in the `/test-suites` directory to have the filename `test-suite_my-test-suite.js`.
- If you import your test suites in the `<script>` tag of the `amatest.html` file, you can load them from wherever you would like.