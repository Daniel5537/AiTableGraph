import {EventDispatcher} from "../../../workflow/events/EventDispatcher";
import {IVisualEdge} from "./IVisualEdge";
import {IDataRenderer} from "../../../base/IDataRenderer";
import {IEdge} from "../data/IEdge";
import {IVisualGraph} from "./IVisualGraph";
import {DecathlonComponent} from "../../../workflow/components/DecathlonComponent";
import {IEdgeRenderer} from "./IEdgeRenderer";
import {Point} from "../../../base/Point";

export class VisualEdge extends EventDispatcher implements IVisualEdge, IDataRenderer {
    private _id: number;
    private _data: object;
    private _edge: IEdge;
    private _vgraph: IVisualGraph;
    private _visible: boolean;
    private _labelView: DecathlonComponent;
    private _lineStyle: object;
    private _centered: boolean;
    private _edgeView: IEdgeRenderer;

    constructor(vg: IVisualGraph, edge: IEdge, id: number, data: object = null, lview: DecathlonComponent = null, lStyle: object = null) {
        super();
        this._vgraph = vg;
        this._edge = edge;
        this._id = id;
        this._visible = undefined;
        this._centered = true;
        this._data = data;
        this._labelView = lview;
        this._lineStyle = lStyle;
    }

    public get edge(): IEdge {
        return this._edge;
    }

    public get vgraph(): IVisualGraph {
        return this._vgraph;
    }

    // [Bindable]
    public get data(): object {
        return this._data;
    }

    public set data(o: object) {
        this._data = o;
    }

    public get id(): number {
        return this._id;
    }

    public get centered(): boolean {
        return this._centered;
    }

    public set centered(c: boolean) {
        this._centered = c;
    }

    public get isVisible(): boolean {
        return this._visible;
    }

    public set isVisible(v: boolean) {
        this._visible = v;

        if (this._labelView != null) {
            this._labelView.visible = v;
        }
    }

    public get labelView(): DecathlonComponent {
        return this._labelView;
    }

    public set labelView(lv: DecathlonComponent) {
        this._labelView = lv;
    }

    public setEdgeLabelCoordinates(p: Point): void {
        if (this._labelView == null || p == null) {
            return;
        }

        // if (this._labelView.width === 0 ||
        //     this._labelView.height === 0) {
        //     // this._labelView.callLater(setEdgeLabelCoordinates,[p]);
        //     return;
        // }

        if (this._centered) {
            this._labelView.x = p.x - (this._labelView.width / 2.0);
            this._labelView.y = p.y - (this._labelView.height / 2.0);
        } else {
            this._labelView.x = p.x;
            this._labelView.y = p.y;
        }

    }

    public set lineStyle(ls: object) {
        this._lineStyle = ls;
    }

    public get lineStyle(): object {
        return this._lineStyle;
    }

    public get edgeView(): IEdgeRenderer {
        return this._edgeView;
    }

    public set edgeView(value: IEdgeRenderer) {
        this._edgeView = value;
    }
}