import {DecathlonCanvas} from "../../../workflow/components/DecathlonCanvas";
import {IVisualGraph} from "./IVisualGraph";
import {DecathlonComponent} from "../../../workflow/components/DecathlonComponent";
import {IVisualNode} from "./IVisualNode";
import {IVisualEdge} from "./IVisualEdge";
import {IFactory} from "../../../workflow/global/IFactory";
import {ClassFactory} from "../../../workflow/global/ClassFactory";
import {Point} from "../../../base/Point";
import {BaseEdgeRenderer} from "./edgeRenderers/BaseEdgeRenderer";
import {IGraph} from "../data/IGraph";
import {ILayoutAlgorithm} from "../layout/ILayoutAlgorithm";
import {INode} from "../data/INode";

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
    protected _graph: IGraph = null;
    protected _layouter: ILayoutAlgorithm;
    protected _currentRootVNode: IVisualNode = null;
    protected _canvas: DecathlonCanvas;
    protected _displayEdgeLabels:boolean = false;

    public _defaultDragBackBound: boolean = true;
    public _displayMouseWheel: boolean = false;

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
        this._edgeRendererFactory = new ClassFactory(BaseEdgeRenderer);
        // this.horizontalScrollPolicy = ScrollPolicy.OFF;
        // this.verticalScrollPolicy = ScrollPolicy.OFF;
        // this.clipContent = true;

        this._origin = new Point(0, 0);
    }

    public set graph(g: IGraph) {
        if (this._graph != null) {
            console.log("WARNING: _graph in VisualGraph was not null when new graph was assigned." + " Some cleanup done, but this may leak memory");
            this.clearHistory();
            this.purgeVGraph();
            this._graph.purgeGraph();

            if (this._layouter != null) {
                this._layouter.resetAll();
            }
            _nodeIDsWithinDistanceLimit = null;
            _prevNodeIDsWithinDistanceLimit = null;
            _noNodesWithinDistance = 0;
        }

        this._graph = g;
        this.initFromGraph();
        this._currentRootVNode = null;

        if (this._graph.nodes.length > 0) {
            this._currentRootVNode = (this._graph.nodes[0] as INode).vnode;
        }

        if (this._defaultDragBackBound) {
            this._canvas.entityAddEventListener(MouseEvent.MOUSE_DOWN, this.backgroundDragBegin, this);
            this._canvas.entityAddEventListener(MouseEvent.MOUSE_UP, this.dragEnd, this);
        }

        if (this._displayMouseWheel)
            this._canvas.entityAddEventListener(MouseEvent.MOUSE_WHEEL, this.mouseWheelHandler, this);

        // need to add
    }

    protected purgeVGraph(): void {

        let ves: Array<any> = [];
        let vns: Array<any> = [];
        let ve: IVisualEdge;
        let vn: IVisualNode;

        for (ve of this._vedges.values()) {
            ves.unshift(ve);
        }
        for (vn of this._vnodes.values()) {
            vns.unshift(vn);
        }

        console.log("purgeVGraph called");

        if (this._graph != null) {
            for (ve of ves) {
                this.removeVEdge(ve);
            }
            for (vn of vns) {
                this.removeVNode(vn);
            }
        } else {
            console.log("we had no graph to purge from, so nothing was done");
        }
    }

    protected createVEdgeView(ve: IVisualEdge): DecathlonComponent {
        let mycomponent: DecathlonComponent = null;
        if (ve.data["is_show_name"] == 1 ) {
            if (this._edgeLabelRendererFactory != null) {
                mycomponent = this._edgeLabelRendererFactory.newInstance();
            } else {
                mycomponent = new Label;
                mycomponent.setStyle("textAlign","center");
                if (ve.data.font_color!=null&&ve.data.font_color!=""){
                    mycomponent.setStyle("color",ve.data.font_color);
                }
                mycomponent.buttonMode = true ;
                mycomponent.setStyle("useHandCursor",true);
                mycomponent.mouseChildren=false;
                if(ve.data != null&&this._displayEdgeLabels) {
                    if(ve.data.edgelabel !=null){
                        (mycomponent as Label).text = ve.data.edgelabel;
                    }else{
                        (mycomponent as Label).text ="link";
                    }
                    mycomponent.toolTip= ve.data.edgelabel;
                    //	mycomponent.doubleClickEnabled = true;
                    //	mycomponent.addEventListener(MouseEvent.CLICK,onLineClick);
                }
            }

            /* assigns the edge to the IDataRenderer part of the view
             * this is important to access the data object of the VEdge
             * which contains information for rendering. */
            if(mycomponent is IDataRenderer) {
                (mycomponent as IDataRenderer).data = ve;
            }

            var vn:IVisualNode;
            var count:Number=0;
            for each(vn in _visibleVNodes) {
                count++;
            }

            /* add the component to its parent component
             * this can create problems, we have to see where we
             * check for all children
             * Add after the edges layer, but below all other elements such as nodes */
            _canvas.addChildAt(mycomponent, count);

            ve.labelView = mycomponent;
            _viewToVEdgeMap[mycomponent] = ve;

            /* set initial default x/y values, these should be in the middle of the
             * edge, but depending on the edge renderer. Thus we should ask
             * the edge renderer, where it wants to place the label. This would
             * be a new method for the edge renderer interface */
            if(_edgeRenderer != null) {
                ve.setEdgeLabelCoordinates(_edgeRenderer.labelCoordinates(ve));
            } else {
                ve.setEdgeLabelCoordinates(new Point(_canvas.width / 2.0, _canvas.height / 2.0));
            }

            /* we need to invalidate the display list since
             * we created new children */
            refresh();
        }
        return mycomponent;
    }

    public removeVEdge(ve: IVisualEdge): void {

        if (ve == null)
            return;

        this.setEdgeVisibility(ve, false);
        ve.edge.vedge = null;
        this._vedges.delete(ve);
    }

    protected removeVNode(vn: IVisualNode): void {

        let view: DecathlonComponent;
        view = vn.rawview;
        vn.view = null;
        vn.node.vnode = null;

        if (view != null) {
            this.removeComponent(view);
        }

        if (this._visibleVNodes.get(vn) !== undefined) {
            this._visibleVNodes.delete(vn);
            --this._noVisibleVNodes;
        }

        this._vnodes.delete(vn);
    }

    public setEdgeVisibility(ve: IVisualEdge, visible: boolean): void {

        let comp: DecathlonComponent;

        if (ve.isVisible === visible) {
            console.log("Tried to set vedge:" + ve.id + " visibility to:" + visible.toString() + " but it was already.");
            return;
        }

        if (visible) {

            this._visibleVEdges.set(ve, ve);

            if (this._displayEdgeLabels && ve.labelView == null)
                comp = this.createVEdgeView(ve);

            ve.isVisible = true;

        } else {
            ve.isVisible = false;
            this._visibleVEdges.delete(ve);

            if (ve.labelView != null) {
                this.removeVEdgeView(ve.labelView);
            }
        }
    }
    center: Point;
    currentRootVNode: IVisualNode;
    displayEdgeLabels: boolean;
    edgeLabelRenderer: IFactory;
    edgeRendererFactory: IFactory;
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