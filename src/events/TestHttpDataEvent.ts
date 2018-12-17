import {EventBase} from "../workflow/events/EventBase";

export class TestHttpDataEvent extends EventBase{

    public static SUCCESS_GET_DATA:string = 'successGetData';
    public data:object;

    constructor(type: string, data: any){
        super(type);
        this.data = data;
    }

    clone():EventBase{
        let event:TestHttpDataEvent = new TestHttpDataEvent(this.type, this.data);
        return event;
    }
}