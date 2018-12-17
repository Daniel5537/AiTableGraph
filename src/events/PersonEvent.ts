import {EventBase} from "../workflow/events/EventBase";
/**
 * Created by Daniel on 2018/9/26.
 */
export class PersonEvent extends EventBase {
    public static TEST_EVENT: string = "testEvent";
    public static TEST_GLOBAL_EVENT: string = "testGlobalEvent";

    constructor(type: string, data: any= null, bubbles: boolean= true) {
        super(type, bubbles);
        this.data = data;
    }

    clone(): EventBase {
        let event: PersonEvent = new PersonEvent(this.type, this.data, true);
        return event;
    }
}