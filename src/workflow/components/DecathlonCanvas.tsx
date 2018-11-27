import * as React from "react";
import {DecathlonComponent} from "./DecathlonComponent";
import {EntityMouseEvent} from "../events/EntityMouseEvent";

export class DecathlonCanvas extends DecathlonComponent {
    constructor(props, context) {
        super(props, context);
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