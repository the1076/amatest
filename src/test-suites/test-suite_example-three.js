import { TestSuite, Test, TestResult } from "../amatest.js";

export default class TestSuite_ExampleThree extends TestSuite
{
    // this is the entry point. Create this function in order to generate your tests.
    async generateTests()
    {
        this.description = 'My Failing Tests:';

        this.addTest(new Test('Now this is what it looks like if your test fails.', FailureTest));
        this.addTest(new Test('And this is what it looks like if your test throws an error.', ExceptionTest));
    }
}

function FailureTest(test)
{
    let error = new Error('You can put a good debug message in here. The stack trace is output, and logged to the dev console for easy debugging.')
    let result = new TestResult(test, false, error);
    return result;
}

function ExceptionTest(test)
{
    throw new Error('This broke.');
}