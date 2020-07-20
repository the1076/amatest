# Introduction 
An amateur (possibly naive) approach to unit/functional/integration testing library built with vanilla JS.  
Asynchronous testing | WebComponents | async/await | ES6

This is a simplified apparatus for advanced users to do quick "workbench" testing and is not a substitute for a fully-featured testing suite.

# Getting Started
Run the files in the `src` folder. Create any test suites following the example in the test-suites `folder`.

# Example
[See an example here.](https://the1076.github.io/amatest/testing)

# Notes
- TestSuites must extend the `TestSuite` class.
- All tests must return a `TestResult` instance.
- `TestSuite`s must be exported as default.
- `TestSuite`s must be stored in the test-suites subfolder, if you're loading them from the manifest.
- The manifest supports two formats: "Definition" or "Name".
  - **"Definition"** means setting the classname and filename with the following format: `{ "className": "TestSuite_MyTestSuite", "path": "my-oddly-named-test-suite.js" }`
  - **"Name"** means just using the classname and letting the library parse it. The entry would therefore be `"TestSuite_MyTestSuite"`. The library would then expect a file in the `/test-suites` directory to have the filename `test-suite_my-test-suite.js`.
- If you import your test suites in the `<script>` tag of the `amatest.html` file, you can load them from wherever you would like.
- If you start your test suite's class name with two slashes (i.e.: "//TestSuite_DoNotUse"), the library will ignore them. This is because you can't put comments in JSON and sometimes you just want to "comment out" a test for a run or two.
- A sandbox instance will take any arbitrary code in it's `execute` function. The code will run as soon as the execute function is called, unless the page hasn't loaded, in which case the code will be called directly AFTER the page load.
- If you use the wrong url in the sandbox, but the url still points to a document, you'll get a failure in your test, rather than an exception for a bad url. Even if that document is a 404 page. I have to learn how to dig that out of an `<iframe>` tag before I can fix that. Best to be extra careful at the moment.
- Cross-origin urls are not currently supported for testing.
- When using a sandbox, the target app must allow the `unsafe-eval` policy. As I do my testing locally, I just drop this meta tag into the app index.html: `<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval'">`.  
  At the moment, there is no API to handle creating a nonce-based policy, but it's possible by editing the `openSandbox` function.