import {EventBase} from "../workflow/events/EventBase";

export class LinkSheetHeaderEvent extends EventBase {
    public static readonly HEADER_SIZE_CHANGE_BTN_DOWN: string = "headerSzieChangeBtnDown";
    public static readonly GET_HEADER_INIT_DATA: string = "getHeaderInitData";

    constructor(type: string, data: any = null, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
        this.data = data;
    }

    public clone(): EventBase {
        let event: LinkSheetHeaderEvent = new LinkSheetHeaderEvent(this.type, this.data, this.bubbles, this.cancelable);
        return event;
    }
}