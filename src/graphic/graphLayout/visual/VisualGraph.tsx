import {DecathlonCanvas} from "../../../workflow/components/DecathlonCanvas";
import {IVisualGraph} from "./IVisualGraph";
import {DecathlonComponent} from "../../../workflow/components/DecathlonComponent";
import {IVisualNode} from "./IVisualNode";
import {IVisualEdge} from "./IVisualEdge";
import {IFactory} from "../../../workflow/global/IFactory";
import {ClassFactory} from "../../../workflow/global/ClassFactory";
import {Point} from "../../../base/Point";

export class VisualGraph extends DecathlonCanvas implements IVisualGraph {
    protected _drag_x_offsetMap: Map<DecathlonComponent, number>;
    protected _drag_y_offsetMap: Map<DecathlonComponent, number>;
    protected _drag_boundsMap: Map<any, any>;
    protected _vnodes: Map<IVisualNode, IVisualNode>;
    protected _vedges: Map<IVisualEdge, IVisualEdge>;
    protected _nodeViewToVNodeMap: Map<DecathlonComponent, IVisualNode>;
    protected _edgeLabelViewToVEdgeMap: Map<DecathlonComponent, IVisualEdge>;
    protected _edgeViewToVEdgeMap: Map<DecathlonComponent, IVisualEdge>;
    protected _visibleVNodes: Map<IVisualNode, IVisualNode>;
    protected _visibleVEdges: Map<IVisualEdge, IVisualEdge>;
    protected _visibleVNodesList: Array<any>;
    protected _visibleVEdgesList: Array<any>;
    protected _noVisibleVNodes: number;
    protected _visibilityLimitActive: boolean = true;
    protected _currentVNodeHistory: Array<any> = null;
    protected _edgeRendererFactory: IFactory = null;
    protected _origin: Point;

    constructor(props, context) {
        super(props, context);
        this._drag_x_offsetMap = new Map<DecathlonComponent, number>();
        this._drag_y_offsetMap = new Map<DecathlonComponent, number>();
        this._drag_boundsMap = new Map<any, any>();
        this._vnodes = new Map<IVisualNode, IVisualNode>();
        this._vedges = new Map<IVisualEdge, IVisualEdge>();
        this._nodeViewToVNodeMap = new Map<DecathlonComponent, IVisualNode>();
        this._edgeLabelViewToVEdgeMap = new Map<DecathlonComponent, IVisualEdge>();
        this._edgeViewToVEdgeMap = new Map<DecathlonComponent, IVisualEdge>();
        this._visibleVNodes = new Map<IVisualNode, IVisualNode>();
        this._visibleVNodesList = [];
        this._visibleVEdges = new Map<IVisualEdge, IVisualEdge>();
        this._visibleVEdgesList = [];
        this._noVisibleVNodes = 0;
        this._visibilityLimitActive = true;
        this._currentVNodeHistory = [];
        // this._edgeRendererFactory = new ClassFactory(BaseEdgeRenderer);
        // this.horizontalScrollPolicy = ScrollPolicy.OFF;
        // this.verticalScrollPolicy = ScrollPolicy.OFF;
        // this.clipContent = true;

        this._origin = new Point(0,0);
    }
    center: Point;
    currentRootVNode: IVisualNode;
    displayEdgeLabels: boolean;
    edgeLabelRenderer: IFactory;
    edgeRendererFactory: IFactory;
    graph: IGraph;
    itemRenderer: IFactory;
    layouter: ILayoutAlgorithm;
    maxVisibleDistance: number;
    noVisibleVNodes: number;
    origin: Point;
    scale: number;
    showHistory: boolean;
    visibilityLimitActive: boolean;
    visibleVEdges: Array<any>;
    visibleVNodes: Array<any>;

    UNSAFE_componentWillMount(): void {
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<IDecathlonComponentProps>, nextContext: any): void {
    }

    UNSAFE_componentWillUpdate(nextProps: Readonly<IDecathlonComponentProps>, nextState: Readonly<{}>, nextContext: any): void {
    }

    addEventListener(type: string, listener: Function, context: any): void {
    }

    calcNodesBoundingBox(): any {
    }

    clearHistory(): void {
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    }

    componentDidMount(): void {
    }

    componentDidUpdate(prevProps: Readonly<IDecathlonComponentProps>, prevState: Readonly<{}>, snapshot?: any): void {
    }

    componentWillMount(): void {
    }

    componentWillReceiveProps(nextProps: Readonly<IDecathlonComponentProps>, nextContext: any): void {
    }

    componentWillUnmount(): void {
    }

    componentWillUpdate(nextProps: Readonly<IDecathlonComponentProps>, nextState: Readonly<{}>, nextContext: any): void {
    }

    createNode(sid: string, o: object): IVisualNode {
        return undefined;
    }

    dispatchEvent(event: EventBase): boolean {
        return false;
    }

    draw(flags: number): void {
    }

    getSnapshotBeforeUpdate(prevProps: Readonly<IDecathlonComponentProps>, prevState: Readonly<{}>): any | null {
        return undefined;
    }

    initFromGraph(): void {
    }

    linkNodes(v1: IVisualNode, v2: IVisualNode): IVisualEdge {
        return undefined;
    }

    redrawEdges(): void {
    }

    redrawNodes(): void {
    }

    refresh(): void {
    }

    removeEventListener(type: string, context: any): void {
    }

    removeNode(vn: IVisualNode): void {
    }

    scroll(sx: number, sy: number, reset: boolean): void {
    }

    shouldComponentUpdate(nextProps: Readonly<IDecathlonComponentProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        return false;
    }

    unlinkNodes(v1: IVisualNode, v2: IVisualNode): void {
    }

}