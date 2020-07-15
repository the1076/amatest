import { DirtyProxy } from "../objects/dirty-proxy.js";

export default class App
{
    constructor()
    {
        let myObject = new SomeObject();
        console.log(myObject);
        myObject.hello = 'mundo';
        console.log(myObject);
    }
}

class SomeObject
{
    constructor()
    {
        this.hello = 'world';

        return new Proxy(this, new DirtyProxy());
    }
}