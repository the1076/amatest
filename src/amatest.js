// CONSTANTS
export const statusClassMap = ['unknown', 'ready', 'inprogress', 'passed', 'failed', 'completed'];
export const statusMessageMap = ['Unknown', 'Ready', 'Testing...', 'Passed', 'Failed', 'Completed'];

//OBJECTS
export class Test
{
    get events()
    {
        if(this._events == null)
        {
            let target = document.createTextNode(null);
            this._events = {};
            this._events.addEventListener = target.addEventListener.bind(target);
            this._events.removeEventListener = target.removeEventListener.bind(target);
            this._events.dispatchEvent = target.dispatchEvent.bind(target);
        }

        return this._events;
    }

    get description()
    {
        return this._description;
    }
    set description(value)
    {
        this._description = value;
        let event = new CustomEvent('propertychange', { detail: { propertyName: 'description' } });
        this.events.dispatchEvent(event);
    }


    get run()
    {
        if(this._boundRun == null)
        {
            this._boundRun = this._run.bind(this, ...this.runParameters)
        }
        return this._boundRun;
    }
    set run(value)
    {
        this._run = value;
        this._boundRun = null;
        let event = new CustomEvent('propertychange', { detail: { propertyName: 'run' } });
        this.events.dispatchEvent(event);
    }

    constructor(description, runFunction, runParams)
    {
        this.description = description || `[OBJECT: ${this.constructor.name}] You should add a description...`;
        this.run = runFunction || this.run;
        this.runParameters = runParams ? [this, ...runParams] : [this];
    }

    async _run(){}
}

export class TestSuite
{
    get events()
    {
        if(this._events == null)
        {
            let target = document.createTextNode(null);
            this._events = {};
            this._events.addEventListener = target.addEventListener.bind(target);
            this._events.removeEventListener = target.removeEventListener.bind(target);
            this._events.dispatchEvent = target.dispatchEvent.bind(target);
        }

        return this._events;
    }

    get description()
    {
        return this._description;
    }
    set description(value)
    {
        this._description = value;
        let event = new CustomEvent('propertychange', { detail: { propertyName: 'description' } });
        this.events.dispatchEvent(event);
    }

    constructor(description)
    {
        this.description = description || `[OBJECT: ${this.constructor.name}] You should add a description...`;
        this.tests = [];
    }

    async generateTests() { }
    async runTests() { return this._execute(); }
    async _execute(tests)
    {
        tests = tests || this.tests || [];
        let results = [];

        for(let i = 0; i < tests.length; i++)
        {
            let test = tests[i];
            results.push(runTest(test));
        }

        return Promise.all(results);
    }

    addTest(test)
    {
        this.tests.push(test);
    }
    removeTest(test)
    {
        this.tests.splice(this.tests.indexOf(test), 1);
    }

    openIFrame(url)
    {
        //TODO: create an iframe, open url, inject script, hook up messaging, return friendly object
    }
}

export class TestResult
{
    constructor(record, success, data)
    {
        this.record = record;
        this.success = success;
        this.data = data;
    }
}

export class TestStatus
{
    static get Unknown() { return 0; }
    static get Ready() { return 1; }
    static get InProgress() { return 2; }
    static get Passed() { return 3; }
    static get Failed() { return 4; }
    static get Complete() { return 5; }
}


//COMPONENTS
const BaseComponent = (htmlElementClass = HTMLElement) => class extends htmlElementClass
{
    // Basic component scaffolding
    static get observedAttributes() { return []; }
    async connectedCallback() { await this._init(); this.__isConnected = true; this.dispatchComponentEvent(this, 'onconnect'); }
    disconnectedCallback() { this.__isConnected = false; this.dispatchComponentEvent(this, 'ondisconnect'); }
    adoptedCallback() { this.dispatchComponentEvent(this, 'onadopted'); }

    // component definition
    constructor(attributes)
    {
        super();
        
        if(attributes != null)
        {
            for(let property in attributes)
            {
                if(attributes.hasOwnProperty(property))
                {
                    this.setAttribute(property, attributes[property]);
                }
            }
        }
    }
    _init(){}

    dispatchComponentEvent($target, eventName, data)
    {
        if($target == this)
        {
            let customEvent = (data) ? new CustomEvent(eventName, { detail: data }) : new CustomEvent(eventName); this.dispatchEvent(customEvent);
        }

        let handlerAttributeName = 'on' + eventName;
        let onEvent = $target.getAttribute(handlerAttributeName);
        if(onEvent)
        {
            try
            {
                onEvent = onEvent.split('.').reduce((o,i)=> { return o[i]; }, window);
                onEvent({target: $target, detail: data });
            }
            catch(exception)
            {
                console.error("Unable to execute callback: " + exception.message);
            }
        }
    }
}

export class TestSuiteComponent extends BaseComponent(HTMLLIElement)
{
    static get observedAttributes() { return []; }
    static register() { if(!customElements.get('test-suite')) { customElements.define('test-suite', TestSuiteComponent, { extends: "li" }); } }

    get status()
    {
        return this._status;
    }
    set status(value)
    {
        this._status = statusMessageMap[value];
        this.classList.remove(...statusClassMap);
        this.classList.add(statusClassMap[value]);

        if(this.$status != null)
        {
            this.$status.innerHTML = this._status;
        }
    }

    constructor(record)
    {
        super();
        this.record = record;
        this.status = TestStatus.Ready;

        this.setAttribute('is', 'test-suite');
    }

    // functionality
    async init()
    {
        this.record.events.addEventListener('propertychange', (event) =>
        {
            if(event.detail.propertyName == 'description')
            {
                this.$description.innerHTML = this.record.description;
            }
            if(event.detail.propertyName == 'status')
            {
                this.status = this.record.status;
                this.$completed.innerHTML = this.status;
            }
        });

        await this._createContent();
    }
    async _createContent()
    {
        let content = `<details open="true">
            <summary title="Expand to see individual tests">
                <span class="description">${this.record.description}</span>
                <span class="status">${this.status}</span>
            </summary>
            <details class="stats">
                <summary>Testing statistics</summary>
                <dl>
                    <div class="elapsed-time">
                        <dt>Elapsed Time</dt>
                        <dd class="value"></dd>
                    </div>
                </dl>
            </details>
            <ul class="tests"></ul>
        </details>`;

        this.innerHTML = content;

        this.$description = this.querySelector('.description');
        this.$status = this.querySelector('.status');
        this.$stats = this.querySelector('.stats');
        this.$stats.$elapsedTime = this.$stats.querySelector('.elapsed-time');
        this.$stats.$elapsedTime.$value = this.$stats.$elapsedTime.querySelector('.value');
        this.$tests = this.querySelector('.tests');

        await this._generateTests();
    }
    async _generateTests()
    {
        await this.record.generateTests();
        for(let i = 0; i < this.record.tests.length; i++)
        {
            let test = this.record.tests[i];
            let $test = new TestComponent(test);
            this.$tests.appendChild($test);
        }
    }

    async runTests()
    {
        let timer = startTimer();
        try
        {
            this.$stats.removeAttribute('open');
            this.status = TestStatus.InProgress;
            let promises = [];
            for(let i = 0; i < this.$tests.children.length; i++)
            {
                let $test = this.$tests.children[i];
                promises.push(runTest($test));
            }
    
            let results = await Promise.all(promises);
    
            let failed = results.find((value) =>
            {
                return value.success == false;
            });
    
            if(failed != null)
            {
                this.status = TestStatus.Failed;
            }
            else
            {
                this.status = TestStatus.Passed;
            }
        }
        catch(exception)
        {
            this.status = TestStatus.Failed;
            return new TestResult(this.record, false, exception);
        }
        finally
        {
            let endTime = endTimer(timer);
            this.$stats.$elapsedTime.$value.innerHTML = endTime;
        }
    }
}

export class TestComponent extends BaseComponent(HTMLLIElement)
{
    static get observedAttributes() { return []; }
    static register() { if(!customElements.get('test-item')) { customElements.define('test-item', TestComponent, { extends: "li" }); } }

    get status()
    {
        return this._status;
    }
    set status(value)
    {
        this._status = statusMessageMap[value];
        this.classList.remove(...statusClassMap);
        this.classList.add(statusClassMap[value]);

        if(value == TestStatus.Failed)
        {
            this.$details.setAttribute('open', true);
        }

        if(this.$status != null)
        {
            this.$status.innerHTML = this._status;
        }
    }

    constructor(record)
    {
        super();
        this.record = record;
        this._createContent();

        this.setAttribute('is', 'test-item');
    }

    // functionality
    _createContent()
    {
        let content = `<details>
            <summary title="Expand to see JSON of result data">
                <span class="description">${this.record.description}</span>
                <span class="status"></span>
            </summary>
            <details class="stats">
                <summary>Testing statistics</summary>
                <dl>
                    <div class="elapsed-time">
                        <dt>Elapsed Time</dt>
                        <dd class="value"></dd>
                    </div>
                </dl>
            </details>
            <textarea class="data"></textarea>
        </details>`;

        this.innerHTML = content;

        this.$details = this.querySelector('details');
        this.$description = this.querySelector('.description');
        this.$status = this.querySelector('.status');
        this.$data = this.querySelector('.data');
        this.$stats = this.querySelector('.stats');
        this.$stats.$elapsedTime = this.$stats.querySelector('.elapsed-time');
        this.$stats.$elapsedTime.$value = this.$stats.$elapsedTime.querySelector('.value');
    }

    async run()
    {
        let timer = startTimer();
        let result;
        try
        {
            this.$details.removeAttribute('open');
            this.status = TestStatus.InProgress;

            let testResult = await this.record.run();
            result = testResult;

            if(result.success == true)
            {
                this.status = TestStatus.Passed;
            }
            else
            {
                this.status = TestStatus.Failed;
            }
        }
        catch(exception)
        {
            this.status = TestStatus.Failed;
            result = new TestResult(this.record, false, exception);
        }
        finally
        {
            let endTime = endTimer(timer);
            this.$stats.$elapsedTime.$value.innerHTML = endTime;

            if(result.data != null)
            {
                try
                {
                    console.log('Test Data: %o', result.data);
                    if(result.data instanceof Error)
                    {
                        this.$data.value = result.data.stack;
                    }
                    else
                    {
                        this.$data.value = JSON.stringify(result.data);
                    }
                }
                catch(exception)
                {
                    this.$data.value = `[ERROR]: An error occurred while trying to parse the custom data. This data may still be viewed in the development console.\r\n[Exception]: ${JSON.stringify(exception, 2)}`;
                    console.error(exception);
                }
            }

            return result;
        }
    }
}

// FUNCTIONS
async function runTest($test)
{
    try
    {
        let result = await $test.run();
        return result;
    }
    catch(exception)
    {
        return new TestResult($test.record, false, exception);
    }
}

export function startTimer()
{
    let startTime = new Date().getTime();
    return startTime;
}
export function endTimer(startTime)
{
    if(startTime == null)
    {
        return '';
    }

    let endTime = new Date().getTime();
    let delta = endTime - startTime;

    return formatTime(delta);
}

function formatTime(delta)
{
    let msToDay = (1000 * 60 * 60 * 24);
    let msToHour = (1000 * 60 * 60);
    let msToMinutes = (1000 * 60);

    let days = Math.floor(delta / msToDay);
    let hours = Math.floor((delta % msToDay) / msToHour);
    let minutes = Math.floor((delta % msToHour) / msToMinutes);
    let seconds = Math.floor((delta % msToMinutes) / 1000);
    let milliseconds = Math.floor((delta % msToMinutes) / 100);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    milliseconds = (milliseconds < 100) ? (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds : milliseconds;

    return `${days}:${hours}:${minutes}:${seconds}:${milliseconds}`;
}