import * as React from "react";
import {DecathlonComponent} from "./DecathlonComponent";
import {CommConst} from "../../graphic/consts/CommConst";

export class DecathlonCanvas<IDecathlonComponentProps> extends DecathlonComponent {
    private _contentMouseX: number = 0;
    private _contentMouseY: number = 0;
    protected _childCollection: Array<any> = [];

    constructor(props, context) {
        super(props, context);
        this.state = {
            childrenElements: [],
        };
    }

    public addChild(componentData: Map<string, any>): void {
        if (componentData != null) {
            this._childCollection.push(componentData);
        }
    }

    public removeChild(component: DecathlonComponent): void {
        if (component == null)
            return;
    }

    public get childCollection(): Array<any> {
        return this._childCollection;
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
                 onDoubleClick={this.entityMouseEventDispatch}>
                {
                    this.state[CommConst.CHILDREN_ELEMENTS].map((item, key) => {
                        const ChildrenComponent = (item as Map<string, any>).get("view");
                        const tmpProps = (item as Map<string, any>).get("props");
                        return < ChildrenComponent key={key} {...tmpProps}/>;
                    })
                }
            </div>
        );
    }
}