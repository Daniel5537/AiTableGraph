import * as React from "react";
import {DecathlonComponent} from "./DecathlonComponent";
import {Mixin} from "react";


export class DecathlonCanvas extends DecathlonComponent {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return(
            <div style={this.state["styleObject"]}>测试基组件</div>
        );
    }
}