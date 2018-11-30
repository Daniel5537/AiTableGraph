import {DecathlonComponent} from "../../../../workflow/components/DecathlonComponent";
import {IEdgeRenderer} from "../IEdgeRenderer";
import {IVisualEdge} from "../IVisualEdge";
import {IVisualNode} from "../IVisualNode";
import {Point} from "../../../../base/Point";
import {Geometry} from "../../../utils/Geometry";

export class BaseEdgeRenderer extends DecathlonComponent implements IEdgeRenderer {
    protected vedge: IVisualEdge;
    private _edgeStyleObj: object;
    protected _fPoint: Point;
    protected _tPoint: Point;
    constructor(props, context) {
        super(props, context);
    }

    public set data(value: object) {
        this.vedge = value as IVisualEdge;
    }

    public get data(): object {
        return this.vedge;
    }

    public set fPoint(value: Point) {
        this._fPoint = value;
    }

    public get fPoint(): Point {
        return this._fPoint;
    }

    public set tPoint(value: Point) {
        this._tPoint = value;
    }

    public get tPoint(): Point {
        return this._tPoint;
    }

    public set edgeStyleObj(value: object) {
        this._edgeStyleObj = value;
    }

    handleMouseClick = (event) => {
        console.log("edge base mouse click");
    }

    handleMouseOverClick = (event) => {
        console.log("edge base mouse over");
    }

    handleMouseOutClick = (event) => {
        console.log("edge base mouse out");
    }

    public draw(): void {
        let fromNode: IVisualNode = this.vedge.edge.node1.vnode;
        let toNode: IVisualNode = this.vedge.edge.node2.vnode;

        if (this.vedge.vgraph.displayEdgeLabels) {
            this.vedge.setEdgeLabelCoordinates(this.labelCoordinates(fromNode.viewCenter, toNode.viewCenter));
        }
    }

    public labelCoordinates(p: Point, q: Point): Point {
        return Geometry.midPointOfLine(p, q);
    }
}