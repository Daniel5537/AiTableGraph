import {EventBase} from "./EventBase";

export class EntityMouseEvent extends EventBase {
    public static CLICK = "click";
    public static MOUSE_DOWN = "mouseDown";
    public static MOUSE_MOVE = "mouseMove";
    public static MOUSE_UP = "mouseUp";
    public static MOUSE_OVER = "mouseOver";
    public static MOUSE_OUT = "mouseOut";
    public static MOUSE_ENTER = "mouseEnter";
    public static MOUSE_LEAVE = "mouseLeave";
    public static DOUBLE_CLICK = "doubleclick";

    constructor(type: string, data: Object= null, bubbles: boolean= true) {
        super(type, bubbles);
        this.data = data;
    }

    clone(): EventBase {
        let event: EntityMouseEvent = new EntityMouseEvent(this.type, this.data, true);
        return event;
    }
}