import {DecathlonComponent} from "../../../workflow/components/DecathlonComponent";
import {LinkSheetConst} from "../../consts/LinkSheetConst";
import {IVisualNode} from "../../graphLayout/visual/IVisualNode";
import {CommConst} from "../../consts/CommConst";
import * as React from "react";
import {LinkSheetNodeImage} from "./LinkSheetNodeImage";
import {EntityMouseEvent} from "../../../workflow/events/EntityMouseEvent";
import {LinkSheetNodeEvent} from "../../../events/LinkSheetNodeEvent";
import {LinkSheetNodeList} from "./LinkSheetNodeList";
import "./LinkSheetNodeRenderer.scss";

export class LinkSheetNodeRenderer extends DecathlonComponent {
    protected _vnode: IVisualNode;
    protected _rendererState: string;
    public isTransformCompassDisplay: boolean;
    constructor(props, context) {
        super(props, context);
        this.state = {
            nodeStatus: CommConst.NODE_ICON_STATE,
        };
    }

    componentDidMount() {
        this.entityAddEventListener(EntityMouseEvent.DOUBLE_CLICK, this.onMouseActionHandler, this);
        this.entityAddEventListener(EntityMouseEvent.MOUSE_DOWN, this.onMouseActionHandler, this);
    }

    onMouseActionHandler = (event: EntityMouseEvent) => {
        switch (event.type) {
            case EntityMouseEvent.DOUBLE_CLICK:
                this.owner.entityDispatchEvent(new LinkSheetNodeEvent(LinkSheetNodeEvent.CHANGE_TO_LIST_STATUS, this));
                break;
            case EntityMouseEvent.MOUSE_DOWN:
                this.owner.entityDispatchEvent(new LinkSheetNodeEvent(LinkSheetNodeEvent.NODE_MOUSE_DOWN, this));
                break;
        }
    }

    public set rendererState(value: string) {
        if (this._rendererState === value)
            return;

        this._rendererState = value;
        this.setState({rendererState: this._rendererState});
    }

    public get rendererState(): string {
        return this._rendererState;
    }

    public set vnode(value: IVisualNode) {
        this._vnode = value;
    }

    public get vnode(): IVisualNode {
        return this._vnode;
    }

    public createCompass(): void {

    }

    public removeCompass(): void {

    }

    render() {
        let nodeView = null;
        switch (this.state[CommConst.NODE_STATUS]) {
            case CommConst.NODE_ICON_STATE:
                nodeView = <LinkSheetNodeImage {...this.props}/>;
                break;
            case CommConst.NODE_TABLE_STATE:
                nodeView = <LinkSheetNodeList {...this.props}/>;
                break;
        }

        return (
            <div className="nodeElement" style={this.styleObj} onDoubleClick={this.entityMouseEventDispatch}>
                {nodeView}
            </div>
        );
    }
}