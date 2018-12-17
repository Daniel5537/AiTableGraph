import {EventBase} from "../workflow/events/EventBase";

export class LinkSheetStepContainerEvent extends EventBase {
    public static readonly MAP_HEADER_STEP_CONTAINER: string = "mapHeaderStepContainer";

    constructor(type: string, data: any = null, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
        this.data = data;
    }

    public clone(): EventBase {
        let event: LinkSheetStepContainerEvent = new LinkSheetStepContainerEvent(this.type, this.data, this.bubbles, this.cancelable);
        return event;
    }
}