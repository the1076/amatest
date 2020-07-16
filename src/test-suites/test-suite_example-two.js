import { TestSuite, Test, TestResult } from "../amatest.js";

export default class TestSuite_ExampleTwo extends TestSuite
{
    // this is the entry point. Create this function in order to generate your tests.
    async generateTests()
    {
        this.description = 'Parameter and data Tests:';
        
        this.addTest(new Test('This is another example. The third parameter must be an array, but it will be an ordered array of parameters to pass in to the test function',
        ParamsTest,
        ["this is the first parameter",
        "and this is the second!"]));

        this.addTest(new Test('This is a third example test. Since the library is asynchronous, you can see that it finishes before the second one, which has been purposefully delayed.', DataTest));
    }
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
    let result = new TestResult(test, true, { description: "This is just some random data sent back from the test.", foo: "The library just stringifies any object back to JSON (if it can) and displays it in the output.", bar: "So anything you need to inspect, post-test, can be done with this feature." });
    return result;
}