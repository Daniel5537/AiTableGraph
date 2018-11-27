import * as React from "react";
import {DecathlonComponent} from "./DecathlonComponent";
import {EntityMouseEvent} from "../events/EntityMouseEvent";

export class DecathlonCanvas extends DecathlonComponent {
    constructor(props, context) {
        super(props, context);
    }

    entityMouseEventDispatch = (event) => {
        switch (event.type) {
            case "click":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.CLICK, event.target));
                break;
            case "mousedown":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.MOUSE_DOWN, event.target));
                break;
            case "mousemove":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.MOUSE_MOVE, event.target));
                break;
            case "mouseup":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.MOUSE_UP, event.target));
                break;
            case "mouseover":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.MOUSE_OVER, event.target));
                break;
            case "mouseout":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.MOUSE_OUT, event.target));
                break;
            case "mouseenter":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.MOUSE_ENTER, event.target));
                break;
            case "mouseleave":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.MOUSE_LEAVE, event.target));
                break;
        }
    }

    render() {
        return(
            <div style={this.state["styleObject"]}
                 onClick={this.entityMouseEventDispatch}
                 onMouseDown={this.entityMouseEventDispatch}
                 onMouseMove={this.entityMouseEventDispatch}
                 onMouseUp={this.entityMouseEventDispatch}
                 onMouseOver={this.entityMouseEventDispatch}
                 onMouseOut={this.entityMouseEventDispatch}
                 onMouseEnter={this.entityMouseEventDispatch}
                 onMouseLeave={this.entityMouseEventDispatch}>测试基组件</div>
        );
    }
}