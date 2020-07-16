import { TestSuite, Test, TestResult } from "../amatest.js";

export default class TestSuite_Example extends TestSuite
{
    // this is the entry point. Create this function in order to generate your tests.
    async generateTests()
    {
        this.description = 'My Tests:';

        this.addTest(new Test('This is an example test. The first parameter is a description.', DescriptionTest));
        
        this.addTest(new Test('This is another example. The third parameter must be an array, but it will be an ordered array of parameters to pass in to the test function',
        ParamsTest,
        ["this is the first parameter",
        "and this is the second!"]));

        this.addTest(new Test('This is a third example test. Since the library is asynchronous, you can see that it finishes before the second one, which has been purposefully delayed.', DataTest));
        this.addTest(new Test('Now this is what it looks like if your test fails.', FailureTest));
        this.addTest(new Test('And this is what it looks like if your test throws an error.', ExceptionTest));
    }
}

function DescriptionTest(test)
{
    // The second parameter of the `addTest` function is the actual function you want to run. Here, you can do anything required in order to complete your test.

    // Tests *MUST* return a TestResult object.
    // The first parameter is the test, itself, which is passed in to this function as the first parameter.
    // The second parameter is the success state.
    // The third parameter is any arbitrary data you want stringified and output into a textbox on the texting UI.
    
    let result = new TestResult(test, true);
    return result;
}

async function ParamsTest(test, param1, param2)
{
    console.log(param1, param2);
    // these parameters should be the parameters that were passed in from the generateTests function.
    
    await new Promise(function(resolve)
    {
        setTimeout(resolve, 4000);
        // throw new Error('shit broke yo');
    });

    let result = new TestResult(test, true);
    return result;

}

function DataTest(test)
{    
    let result = new TestResult(test, true, { description: "This is just some random data sent back from the test.", foo: "The library just stringifies any object back to JSON (if it can) and displays it in the output.", bar: "So anything you need to inspect, post-test, can be done with this feature."});
    return result;
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