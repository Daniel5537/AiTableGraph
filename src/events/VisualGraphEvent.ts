import {EventBase} from "../workflow/events/EventBase";

export class VisualGraphEvent extends EventBase {
    public static readonly BACKGROUND_DRAG_END: string = "visualGraphDragEnd";
    public static readonly BACKGROUND_CLICK: string = "visualGraphClick";
    public static readonly BEGIN_ANIMATION: string = "visualGraphBeginAnimation";
    public static readonly END_ANIMATION: string = "visualGraphEndAnimation";
    public static readonly GRAPH_UPDATED: string = "visualGraphUpdated";
    public static readonly GRAPH_SCALED: string = "visualGraphScaled";

    constructor(type: string, data: any = null, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
        this.data = data;
    }

    public clone(): EventBase {
        let event: VisualGraphEvent = new VisualGraphEvent(this.type, this.data, this.bubbles, this.cancelable);
        return event;
    }
}