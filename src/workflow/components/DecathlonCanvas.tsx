import * as React from "react";
import {DecathlonComponent} from "./DecathlonComponent";

export class DecathlonCanvas<IDecathlonComponentProps> extends DecathlonComponent {
    private _contentMouseX: number = 0;
    private _contentMouseY: number = 0;

    constructor(props, context) {
        super(props, context);
    }

    public set contentMouseY(value: number) {
        this._contentMouseY = value;
    }

    public get contentMouseY(): number {
        return this._contentMouseY;
    }

    public set contentMouseX(value: number) {
        this._contentMouseX = value;
    }

    public get contentMouseX(): number {
        return this._contentMouseX;
    }

    componentWillMount() {
        super.componentWillMount();
    }

    render() {
        return (
            <div style={this.state["styleObject"]}
                 className={this.props.className}
                 onClick={this.entityMouseEventDispatch}
                 onMouseDown={this.entityMouseEventDispatch}
                 onMouseMove={this.entityMouseEventDispatch}
                 onMouseUp={this.entityMouseEventDispatch}
                 onMouseOver={this.entityMouseEventDispatch}
                 onMouseOut={this.entityMouseEventDispatch}
                 onMouseEnter={this.entityMouseEventDispatch}
                 onMouseLeave={this.entityMouseEventDispatch}
                 onDoubleClick={this.entityMouseEventDispatch}>测试基组件</div>
        );
    }
}