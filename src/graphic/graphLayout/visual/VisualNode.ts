import {EventDispatcher} from "../../../workflow/events/EventDispatcher";
import {IVisualNode} from "./IVisualNode";
import {IDataRenderer} from "../../../base/IDataRenderer";
import {DecathlonComponent} from "../../../workflow/components/DecathlonComponent";
import {INode} from "../data/INode";
import {IVisualGraph} from "./IVisualGraph";
import {Point} from "../../../base/Point";
import {IVisualEdge} from "./IVisualEdge";
import {IEdge} from "../data/IEdge";
import {VGraphEvent} from "../../utils/events/VGraphEvent";

export class VisualNode extends EventDispatcher implements IVisualNode, IDataRenderer {
    // private static _LOG: string = "graphLayout.visual.VisualNode";
    private _vgraph: IVisualGraph;
    private _id: number;
    private _data: object;
    private _moveable: boolean;
    private _visible: boolean;
    private _node: INode;
    private _x: number;
    private _y: number;
    private _view: DecathlonComponent;
    private _centered: boolean;
    private _orientAngle: number = 0;

    constructor(vg: IVisualGraph, node: INode, id: number, view: DecathlonComponent = null, data: object = null, mv: boolean = true) {
        super();
        this._vgraph = vg;
        this._node = node;
        this._id = id;
        this._data = data;
        this._moveable = mv;
        this._visible = undefined;
        this._centered = true;
        this._x = 0;
        this._y = 0;
        this._view = view;
    }

    public get vgraph(): IVisualGraph {
        return this._vgraph;
    }

    public get id(): number {
        return this._id;
    }

    public get isVisible(): boolean {
        return this._visible;
    }

    public set isVisible(v: boolean) {
        this._visible = v;

        if (this._view != null) {
            this._view.visible = v;
        }
    }

    public get node(): INode {
        return this._node;
    }

    public get data(): object {
        return this._data;
    }

    public set data(o: object) {
        this._data = o;
    }

    public get centered(): boolean {
        return this._centered;
    }

    public set centered(c: boolean) {
        this._centered = c;
    }

    public get x(): number {
        return this._x;
    }

    public set x(n: number) {
        if (!isNaN(n)) {
            this._x = n;
        } else {
            throw Error("VNode " + this._id + ": set x tried to set NaN");
        }
    }

    public get y(): number {
        return this._y;
    }

    public set y(n: number) {
        if (!isNaN(n)) {
            this._y = n;
        } else {
            throw Error("VNode " + this._id + ": set y tried to set NaN");
        }
    }

    public get viewX(): number {
        return this.view.x;
    }

    public set viewX(n: number) {
        if (!isNaN(n)) {
            if ((n !== this.view.x) && this._moveable) {
                this.view.x = n;
            }
        } else {
            throw Error("VNode " + this._id + ": set viewX tried to set NaN");
        }
    }

    public get viewY(): number {
        return this.view.y;
    }

    public set viewY(n: number) {
        if (!isNaN(n)) {
            if ((n !== this.view.y) && this._moveable) {
                this.view.y = n;
            }
        } else {
            throw Error("VNode " + this._id + ": set viewY tried to set NaN");
        }
    }

    public get rawview(): DecathlonComponent {
        return this._view;
    }

    public get view(): DecathlonComponent {
        return this._view;
    }

    public set view(v: DecathlonComponent) {
        this._view = v;
    }

    public get viewCenter(): Point {
        if (this._view != null) {
            if (this._centered) {
                return new Point(this._view.x + (this._view.width / 2.0),
                    this._view.y + (this._view.height / 2.0));
            } else {
                return new Point(this._view.x, this._view.y);
            }
        } else {
            return null;
        }
    }

    public get moveable(): boolean {
        return this._moveable;
    }

    public set moveable(value: boolean) {
        this._moveable = value;
    }

    public get orientAngle(): number {
        return this._orientAngle;
    }

    public set orientAngle(oa: number) {
        this._orientAngle = oa;
        this.view.entityDispatchEvent(new VGraphEvent(VGraphEvent.VNODE_UPDATED));
    }

    public commit(): void {

        if (this.view == null)
            return;

        // if (this.view.initialized == false) {
        //     view.callLater(commit);
        //     return;
        // }

        if (this._centered) {
            this.viewX = this._x - (this.view.width / 2.0);
            this.viewY = this._y - (this.view.height / 2.0);

        } else {
            this.viewX = this._x;
            this.viewY = this._y;
        }

        this.updateReleatedEdges();

        this.view.entityDispatchEvent(new VGraphEvent(VGraphEvent.VNODE_UPDATED));

    }

    public refresh(): void {

        if (this.view == null)
            return;

        // if(view.initialized == false)
        // {
        //     view.callLater(refresh);
        //     return;
        // }

        if (this._centered) {
            this._x = this.viewX + (this.view.width / 2.0);
            this._y = this.viewY + (this.view.height / 2.0);
        } else {
            this._x = this.viewX;
            this._y = this.viewY;
        }

        this.updateReleatedEdges();
    }

    public updateReleatedEdges(): void {
        for (let edge of this.vedges) {
            // if (edge.edgeView != null)
                // ((edge as IVisualEdge).edgeView).render(false);
        }
    }

    public get vedges(): Array<any> {
        let edge: IEdge;
        let retVal: Array<any> = [];

        for (edge of this.node.inEdges) {
            if (retVal.indexOf(edge.vedge) === -1)
                retVal.push(edge.vedge);
        }

        for (edge of this.node.outEdges) {
            if (retVal.indexOf(edge.vedge) === -1)
                retVal.push(edge.vedge);
        }

        return retVal;
    }
}