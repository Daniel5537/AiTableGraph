import {EventBase} from "../workflow/events/EventBase";

export class VisualNodeEvent extends EventBase {
    public static readonly CLICK: string = "visualNodeClick";
    public static readonly DOUBLE_CLICK: string = "visualNodeDoubleClick";
    public static readonly DRAG_START: string = "visualNodeDragStart";
    public static readonly DRAG_END: string = "visualNodeDragEnd";

    constructor(type: string, data: any = null, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
        this.data = data;
    }

    public clone(): EventBase {
        let event: VisualNodeEvent = new VisualNodeEvent(this.type, this.data, this.bubbles, this.cancelable);
        return event;
    }
}