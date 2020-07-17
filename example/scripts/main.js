import { DirtyProxy } from "../objects/dirty-proxy.js";

export default class App
{
    constructor()
    {
        this.myObject = new SomeObject();
        console.log(this.myObject);
        this.myObject.hello = 'mundo';
        console.log(this.myObject);
    }

    ping()
    {
        return 'pong';
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