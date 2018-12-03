import {EventDispatcher} from "../../../workflow/events/EventDispatcher";
import {IEnhancedVisualNode} from "../IEnhancedVisualNode";
import {IDataRenderer} from "../../../base/IDataRenderer";
import {DecathlonComponent} from "../../../workflow/components/DecathlonComponent";
import {Point} from "../../../base/Point";
import {INode} from "../../graphLayout/data/INode";
import {IVisualGraph} from "../../graphLayout/visual/IVisualGraph";
import {VGraphEvent} from "../../utils/events/VGraphEvent";
import {BaseNodeRenderer} from "../../graphLayout/visual/nodeRenderers/BaseNodeRenderer";

export class EnhancedVisualNode extends EventDispatcher implements IEnhancedVisualNode, IDataRenderer {
    private _labelView: DecathlonComponent;
    protected _outEdgeDot: Point;
    protected _inEdgeDot: Point;
    private _data: object;
    protected _vgraph: IVisualGraph;
    protected _id: number;
    private _moveable: boolean;
    private _visible: boolean;
    protected _node: INode;
    private _x: number;
    private _y: number;
    private _view: BaseNodeRenderer;
    private _centered: boolean;
    private _orientAngle: number = 0;
    protected dotOffset: number = 10;

    constructor(vg: IVisualGraph,
                node: INode,
                id: number,
                view: BaseNodeRenderer = null,
                data: object = null,
                mv: boolean = true) {
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

    public set data(value: object) {
        this._data = value;
    }

    public get data(): object {
        return this._data;
    }

    public set labelView(value: DecathlonComponent) {
        this._labelView = value;
    }

    public get labelView(): DecathlonComponent {
        return this._labelView;
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

        if (this._labelView != null) {
            this._labelView.visible = v;
        }

        if (this._view != null) {
            this._view.visible = v;
        }
    }

    public get node(): INode {
        return this._node;
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
            // throw Error("VNode " + _id + ": set x tried to set NaN");
        }
    }

    public get y(): number {
        return this._y;
    }

    public set y(n: number) {
        if (!isNaN(n)) {
            this._y = n;
        } else {
            // throw Error("VNode " + _id + ": set y tried to set NaN");
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
            // throw Error("VNode " + _id + ": set viewX tried to set NaN");
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
            // throw Error("VNode " + _id + ": set viewY tried to set NaN");
        }
    }

    public setNodeLabelCoordinates(): void {
        if (this._labelView != null) {
            let p: Point = this.view.labelCoordinates(this._labelView);
            if (p != null) {
                this._labelView.x = p.x;
                this._labelView.y = p.y;
            }
        }
    }

    public get rawview(): BaseNodeRenderer {
        return this._view;
    }

    public get view(): BaseNodeRenderer {
        return this._view;
    }

    public set view(v: BaseNodeRenderer) {
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

    public get outEdgeDot(): Point {
        return new Point(this._view.x + (this._view.width / 2.0),
            this._view.y + (this._view.height / 2.0) - this.dotOffset);
    }

    public get inEdgeDot(): Point {
        return new Point(this._view.x + (this._view.width / 2.0),
            this._view.y + (this._view.height / 2.0) + this.dotOffset);
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
        // if(!(this.view is DefaultFieldRenderer)){
        //     if (this._centered) {
        //         this.viewX = this._x - (this.view.width / 2.0);
        //         this.viewY = this._y - (this.view.height / 2.0);
        //
        //     } else {
                this.viewX = this._x;
                this.viewY = this._y;
            // }
        // }

        this.setNodeLabelCoordinates();
        this.view.entityDispatchEvent(new VGraphEvent(VGraphEvent.VNODE_UPDATED));

    }

    public refresh(): void {
        if (this._centered) {
            this._x = this.viewX + (this.view.width / 2.0);
            this._y = this.viewY + (this.view.height / 2.0);
        } else {
            this._x = this.viewX;
            this._y = this.viewY;
        }
        this.setNodeLabelCoordinates();
    }

    public refreshLabelCoordinates(): void {
        this.setNodeLabelCoordinates();
    }
}