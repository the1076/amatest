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

function ParamsTest(test, param1, param2)
{
    console.log(param1, param2);
    // these parameters should be the parameters that were passed in from the generateTests function.
    
    let result = new TestResult(test, true);
    return result;

}