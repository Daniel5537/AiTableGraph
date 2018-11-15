import {EventDispatcher} from "./workflow/events/EventDispatcher";
import {PersonEvent} from "./events/PersonEvent";
import {EventBus} from "./workflow/global/EventBus";
import {TestCommand} from "./commands/TestCommand";
import {TestHttpDataEvent} from "./events/TestHttpDataEvent";
/**
 * Created by Daniel on 2018/9/25.
 */
class Person extends EventDispatcher{
    private _name:string;
    constructor(){
        super();
        this.addEventListener(PersonEvent.TEST_EVENT, this.onEventHandler, this);
        this.init();
    }

    private onEventHandler(event:PersonEvent):void{
        console.log('private event');
        console.log(event.data);
    }

    private init(){
        EventBus.getInstance().addEventListener(PersonEvent.TEST_GLOBAL_EVENT, this.onGlobalEventHandler, this);
    }

    private onGlobalEventHandler(event:PersonEvent){
        this._name = event.data['name'];
        console.log('global event');
        console.log(this._name);
        let testCommand:TestCommand = new TestCommand('xxx', {user_name:'1', user_password:'c4ca4238a0b923820dcc509a6f75849b'});
        testCommand.addEventListener(TestHttpDataEvent.SUCCESS_GET_DATA, onGetDataHandler, this);
    }
}

let p1:Person = new Person();
p1.dispatchEvent(new PersonEvent(PersonEvent.TEST_EVENT, {name: 'Kevin'}));
let p2:Person = new Person();
p2.dispatchEvent(new PersonEvent(PersonEvent.TEST_EVENT, {name: 'Alice'}));

EventBus.getInstance().dispatchEvent(new PersonEvent(PersonEvent.TEST_GLOBAL_EVENT, {name: 'All people'}));

EventBus.getInstance().dispatchEvent(new PersonEvent(PersonEvent.TEST_GLOBAL_EVENT, {name: 'All people'}));

let testCommand:TestCommand = new TestCommand('xxx', {user_name:'1', user_password:'c4ca4238a0b923820dcc509a6f75849b'});
testCommand.addEventListener(TestHttpDataEvent.SUCCESS_GET_DATA, onGetDataHandler, testCommand, true);

function onGetDataHandler(event:TestHttpDataEvent){
    console.log(event.data);
    console.log('hh');
}






