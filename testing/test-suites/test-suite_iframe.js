import { TestSuite, Test, TestResult } from "../amatest.js";

export default class TestSuite_iframe extends TestSuite
{
    // this is the entry point. Create this function in order to generate your tests.
    async generateTests()
    {
        this.description = 'App - Functional Tests:';

        let sandbox = await this.openSandbox('../index.html');

        this.addTest(new Test('The "ping" function should return the value "pong"', IFrameTest, [sandbox]));
    }
}

async function IFrameTest(test, sandbox)
{

    let value = await sandbox.execute("window.App.ping()");

    let success = false;
    if(value.message == "pong")
    {
        success = true;
    }

    let result = new TestResult(test, success, "Response value: " + value.message);
    return result;
}