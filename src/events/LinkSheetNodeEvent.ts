import {EventBase} from "../workflow/events/EventBase";

export class LinkSheetNodeEvent extends EventBase {
    public static readonly CHANGE_TO_LIST_STATUS: string = "changeToListStatus";
    public static readonly CHANGE_TO_NODE_STATUS: string = "changeToNodeStatus";
    public static readonly GO_TO_NEXT_FLOOR: string = "goToNextFloor";
    public static readonly NODE_MOUSE_DOWN: string = "nodeMouseDown";

    constructor(type: string, data: any = null, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
        this.data = data;
    }

    public clone(): EventBase {
        let event: LinkSheetNodeEvent = new LinkSheetNodeEvent(this.type, this.data, this.bubbles, this.cancelable);
        return event;
    }
}