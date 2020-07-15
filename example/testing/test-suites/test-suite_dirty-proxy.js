import { TestSuite, Test, TestResult } from "../amatest.js";
import { DirtyProxy } from "../../objects/dirty-proxy.js";

export default class TestSuite_DirtyProxy extends TestSuite
{
    async generateTests()
    {
        this.description = 'DirtyProxy Tests:';

        // this.addTest(new Test_Proxies("Test Proxies"));
        this.addTest(new Test('Changing an atomic type should set the object\'s isDirty property to True', Proxy_AtomicTypeTest, ['a']));
        this.addTest(new Test('Just checking another thing', Proxy_AtomicTypeTest2));
    }
}

function Proxy_AtomicTypeTest(test, param1)
{
    // console.log(test, param1);
    throw new Error('Butts and butts');
    let source = { a: true, b: 1, c: "hello", d: ["one", "two", "three"], e: { four: 4, five: "five", six: () => { console.log("Hello world"); } } };
    let target = new Proxy(source, DirtyProxy());

    if(target.isDirty == true)
    {
        throw new Error('Target is already dirty.');
    }

    target.a = false;
    
    let result = new TestResult(test, (target.isDirty == true));
    return result;

}
function Proxy_AtomicTypeTest2(test, param1)
{
    return new Promise((resolve, reject)=>
    {
        setTimeout(() =>
        {
            // console.log(test, param1);
            // throw new Error('Butts and butts');
            let source = { a: true, b: 1, c: "hello", d: ["one", "two", "three"], e: { four: 4, five: "five", six: () => { console.log("Hello world"); } } };
            let target = new Proxy(source, DirtyProxy());
        
            if(target.isDirty == true)
            {
                throw new Error('Target is already dirty.');
            }
        
            target.a = false;
            
            let result = new TestResult(test, (target.isDirty == true), { description: "This is just some extra data!" });
            resolve(result);
        }, 2000);
    });

}