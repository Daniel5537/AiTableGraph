import {DecathlonCanvas} from "../../../workflow/components/DecathlonCanvas";
import {IVisualGraph} from "./IVisualGraph";
import {DecathlonComponent} from "../../../workflow/components/DecathlonComponent";
import {IVisualNode} from "./IVisualNode";
import {IVisualEdge} from "./IVisualEdge";
import {IFactory} from "../../../workflow/global/IFactory";
import {ClassFactory} from "../../../workflow/global/ClassFactory";
import {ComponentFactory} from "../../../workflow/global/ComponentFactory";
import {Point} from "../../../base/Point";
import {BaseEdgeRenderer} from "./edgeRenderers/BaseEdgeRenderer";
import {IGraph} from "../data/IGraph";
import {ILayoutAlgorithm} from "../layout/ILayoutAlgorithm";
import {INode} from "../data/INode";
import {DecathlonLable} from "../../../workflow/components/DecathlonLable";
import * as React from "react";
import {IDataRenderer} from "../../../base/IDataRenderer";
import {IEdgeRenderer} from "./IEdgeRenderer";
import {IComponentFactory} from "../../../workflow/global/IComponentFactory";
import {IEdge} from "../data/IEdge";
import {number} from "prop-types";
import {VGraphEvent} from "../../utils/events/VGraphEvent";
import {VisualNode} from "./VisualNode";
import {VisualEdge} from "./VisualEdge";
import {EntityMouseEvent} from "../../../workflow/events/EntityMouseEvent";

export class VisualGraph extends DecathlonCanvas implements IVisualGraph {
    private _nodeEntityViews: Array<any> = [];
    private _edgeEntityViews: Array<any> = [];
    private _nodeLabelEntityViews: Array<any> = [];
    private _edgeLabelEntityViews: Array<any> = [];

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
    protected _edgeRendererFactory: IComponentFactory = null;
    protected _edgeRenderer: IEdgeRenderer = null;
    protected _origin: Point;
    protected _graph: IGraph = null;
    protected _layouter: ILayoutAlgorithm;
    protected _currentRootVNode: IVisualNode = null;
    protected _canvas: DecathlonCanvas;
    protected _displayEdgeLabels: boolean = false;
    protected _edgeLabelRendererFactory: IComponentFactory = null;
    protected _viewToVEdgeMap: Map<DecathlonComponent, IVisualEdge>;
    protected _nodeIDsWithinDistanceLimit: Map<IVisualNode, IVisualNode>;
    protected _prevNodeIDsWithinDistanceLimit: Map<IVisualNode, IVisualNode>;
    protected _noNodesWithinDistance: number;
    protected _componentCounter: number = 0;
    protected _itemRendererFactory: IComponentFactory = null;
    protected _maxVisibleDistance: number = 32767;
    protected _scrollBackgroundInDrag: boolean = true;
    protected _moveNodeInDrag: boolean = true;
    protected _showCurrentNodeHistory: boolean = true;
    protected _configMoveNodes: Map<IVisualNode, IVisualNode>;
    protected _dragComponent: DecathlonComponent;
    protected _backgroundDragInProgress: boolean = false;
    protected _dragCursorStartX: number;
    protected _dragCursorStartY: number;
    protected _drawingSurface: DecathlonComponent;
    protected _newNodesDefaultVisible: boolean = true;
    protected _isDrawLine: boolean = false;
    protected _isMouseEnterFirst: boolean = true;
    protected _isLineTopShow: boolean = false;

    public _defaultDragBackBound: boolean = true;
    public _displayMouseWheel: boolean = false;
    public _viewToVNodeMap: Map<DecathlonComponent, IVisualNode>;
    public _defaultDragAllNode: boolean = false;
    public _defaultDoubleClick: boolean = true;
    public _dragEnable: boolean = false;
    public dragLockCenter: boolean = false;

    constructor(props, context) {
        super(props, context);
        this._drag_x_offsetMap = new Map<DecathlonComponent, number>();
        this._drag_y_offsetMap = new Map<DecathlonComponent, number>();
        this._drag_boundsMap = new Map<any, any>();
        this._vnodes = new Map<IVisualNode, IVisualNode>();
        this._vedges = new Map<IVisualEdge, IVisualEdge>();
        this._viewToVNodeMap = new Map<DecathlonComponent, IVisualNode>();
        // this._nodeViewToVNodeMap = new Map<DecathlonComponent, IVisualNode>();
        // this._edgeLabelViewToVEdgeMap = new Map<DecathlonComponent, IVisualEdge>();
        // this._edgeViewToVEdgeMap = new Map<DecathlonComponent, IVisualEdge>();
        this._visibleVNodes = new Map<IVisualNode, IVisualNode>();
        this._visibleVNodesList = [];
        this._visibleVEdges = new Map<IVisualEdge, IVisualEdge>();
        this._visibleVEdgesList = [];
        this._viewToVEdgeMap = new Map<DecathlonComponent, IVisualEdge>();
        this._noVisibleVNodes = 0;
        this._visibilityLimitActive = true;
        this._currentVNodeHistory = [];
        this._edgeRendererFactory = new ComponentFactory(BaseEdgeRenderer);
        // this.horizontalScrollPolicy = ScrollPolicy.OFF;
        // this.verticalScrollPolicy = ScrollPolicy.OFF;
        // this.clipContent = true;

        this._origin = new Point(0, 0);
        this.state = {
            nodeChildren: [],
            nodeLabelChildren: [],
            edgeChildren: [],
            edgeLabelChildren: []
        };
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

            this._nodeIDsWithinDistanceLimit = null;
            this._prevNodeIDsWithinDistanceLimit = null;
            this._noNodesWithinDistance = 0;
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

    public set dragBackBound(value: boolean) {


        if(value){
            this._canvas.addEventListener(MouseEvent.MOUSE_DOWN,backgroundDragBegin);
            this._canvas.addEventListener(MouseEvent.MOUSE_UP,dragEnd);
        }else{

            this._canvas.removeEventListener(MouseEvent.MOUSE_DOWN,backgroundDragBegin);
            this._canvas.removeEventListener(MouseEvent.MOUSE_UP,dragEnd);
        }

        this._defaultDragBackBound = value;
    }

    public get canvas(): DecathlonCanvas{
        return this._canvas;
    }

    public get graph(): IGraph {
        return this._graph;
    }

    public get defaultDragAllNode(): boolean{

        return this._defaultDragAllNode;
    }

    public set itemRenderer(ifac: IComponentFactory) {
        if (ifac !== this._itemRendererFactory) {
            this._itemRendererFactory = ifac;
        }
    }

    public get itemRenderer(): IComponentFactory {
        return this._itemRendererFactory;
    }

    public set edgeRenderer(er: IEdgeRenderer) {
        this._edgeRenderer = er;
    }

    public get edgeRenderer(): IEdgeRenderer {
        return this._edgeRenderer;
    }

    public set edgeLabelRenderer(elr: IComponentFactory) {
        if (elr !== this._edgeLabelRendererFactory) {
            this.setAllEdgesInVisible();

            this._edgeLabelRendererFactory = elr;

            this.updateEdgeVisibility();
        }
    }

    public get edgeLabelRenderer(): IComponentFactory {
        return this._edgeLabelRendererFactory;
    }

    public set displayEdgeLabels(del: boolean) {
        // let e: IEdge;

        if (this._displayEdgeLabels === del) {
            this._displayEdgeLabels = del;
        } else {
            this._displayEdgeLabels = del;
            this.setAllEdgesInVisible();
            this.updateEdgeVisibility();
        }
    }

    public get displayEdgeLabels(): boolean {
        return this._displayEdgeLabels;
    }

    public get layouter(): ILayoutAlgorithm {
        return this._layouter;
    }

    public set layouter(l: ILayoutAlgorithm) {
        if (this._layouter != null) {
            this._layouter.resetAll();
        }
        this._layouter = l;
    }

    public get origin(): Point {
        return this._origin;
    }

    public get center(): Point {
        return new Point(this._canvas.width / 2.0, this._canvas.height / 2.0);
    }

    public get visibleVNodes(): Map<IVisualNode, IVisualNode> {
        return this._visibleVNodes;
    }

    public get noVisibleVNodes(): number {
        return this._noVisibleVNodes;
    }

    public get visibleVEdges(): Map<IVisualEdge, IVisualEdge> {
        return this._visibleVEdges;
    }

    // [Bindable]
    public get visibilityLimitActive(): boolean {
        return this._visibilityLimitActive;
    }

    public set visibilityLimitActive(ac: boolean) {
        if (this._visibilityLimitActive !== ac) {
            this._visibilityLimitActive = ac;

            if (ac) {
                if (this._currentRootVNode == null) {
                    console.log("No root selected, not creating limited graph, not doing anything.");
                    return;
                }

                this.setDistanceLimitedNodeIds(this._graph.getTree(this._currentRootVNode.node, false, false).getLimitedNodes(this._maxVisibleDistance));

                this.updateVisibility();
            } else {
                this.updateVisibility();
            }
        }
    }

    public get maxVisibleDistance(): number {
        return this._maxVisibleDistance;
    }

    public set maxVisibleDistance(md: number) {
        if (this._maxVisibleDistance !== md) {
            this._maxVisibleDistance = md;

            if (this._visibilityLimitActive) {
                if (this._currentRootVNode == null) {
                    console.log("No root selected, not creating limited graph");
                    return;
                } else {
                    this.setDistanceLimitedNodeIds(_graph.getTree(_currentRootVNode.node, false, false).getLimitedNodes(this._maxVisibleDistance));
                    this.updateVisibility();
                }
            }
        }
    }

    public get currentRootSID(): string {
        return this._currentRootVNode.node.stringid;
    }

    // [Bindable]
    public get currentRootVNode(): IVisualNode {
        return this._currentRootVNode;
    }

    public set currentRootVNode(vn: IVisualNode) {
        if (this._currentRootVNode !== vn) {
            this._currentRootVNode = vn;

            this._currentVNodeHistory.unshift(this._currentRootVNode);
        }
    }

    public set scrollBackgroundInDrag(f: boolean) {
        this._scrollBackgroundInDrag = f;
    }

    public set moveNodeInDrag(f: boolean) {
        this._moveNodeInDrag = f;
    }

    public get showHistory(): boolean {
        return this._showCurrentNodeHistory;
    }

    public set showHistory(h: boolean) {
        if (this._showCurrentNodeHistory !== h) {
            this._showCurrentNodeHistory = h;
            if (this._currentRootVNode != null) {
                if (this._visibilityLimitActive) {
                    this.updateVisibility();
                }
            }
        }
    }

    public get scale(): number {
        return this._scale;
    }

    public set scale(s: number) {

        let i: number;
        let children:Array;
        let view: DecathlonComponent;

        const s0: number = this.scaleX;

        this.scaleX = s;
        this.scaleY = s;

        this.zoom_scroll(this.center.x * (1 - s / s0) / s, this.center.y * (1 - s / s0) / s);

        this.refresh();

        this._scale = s;
    }

    public initFromGraph(): void {
        let bgnode: INode;
        let node: INode;
        let edge:IEdge;

        // background node to show
        // for each(bgnode in this._graph.bgnodes){
        //
        //     this.createBGVNode(bgnode);
        // }

        //	if(isLineTopShow){
        // if (!this._canvas.contains(this._drawingSurface)){
        //     this._canvas.addChild(_drawingSurface);
        // }
        //}

        for (node of this._graph.nodes) {
            this.createVNode(node);
        }

        for (edge of thi._graph.edges) {
            this.createVEdge(edge);
        }
    }

    public clearHistory(): void {
        this._currentVNodeHistory = [];
    }

    public function calcNodesBoundingBox():Rectangle {

        let children: Array<any>;
        let result: any = null;
        // let result: Rectangle;
        //
        // children = this._canvas.getChildren();
        //
        // result = new Rectangle(999999, 999999, -999999, -999999);
        //
        // //trace("THIS CANVAS currently HAS:"+children.length+" children!!");
        //
        // if (children.length == 0) {
        //     console.log("Canvas has no children, not even the drawing surface!");
        //     return null;
        // }
        //
        // for(var i:int = 0;i < children.length; ++i) {
        //
        //     var view:UIComponent = (children[i] as UIComponent);
        //
        //     /* only consider currently visible views */
        //     if(view.visible) {
        //         if(view != _drawingSurface) {
        //             result.left = Math.min(result.left, view.x);
        //             result.right = Math.max(result.right, view.x + view.width);
        //             result.top = Math.min(result.top, view.y);
        //             result.bottom = Math.max(result.bottom, view.y+view.height);
        //         } else {
        //             if(children.length == 1) {
        //                 /* only child is the drawing surface, we return an empty Rectangle
        //                  * anchored in the middle */
        //                 return new Rectangle(_canvas.width / 2, _canvas.height / 2, 0, 0);
        //             }
        //         }
        //     }
        // }
        return result;
    }

    public createNode(sid: string = "", o: object = null): IVisualNode {

        let gnode: INode;
        let vnode: IVisualNode;

        console.log(o["node_dee"]);

        if(o["node_deep"] != null && o["node_deep"] == -1) {
            gnode = this._graph.createBgNode(sid, o);

            vnode = this.createBGVNode(gnode);
        } else {
            gnode = this._graph.createNode(sid, o);

            vnode = this.createVNode(gnode);
        }

        this._currentRootVNode = vnode;

        return vnode;
    }

    public removeBGNode(vn: IVisualNode): void {

        let n: INode;
        // let e: IEdge;
        // let ve: IVisualEdge;
        // let i: number;

        n = vn.node;

        this.removeVNode(vn);

        this._graph.removeBGNode(n);

        this.refresh();
    }

    public removeNode(vn: IVisualNode): void {

        let n: INode;
        let e: IEdge;
        let ve: IVisualEdge;
        // let i: number;

        n = vn.node;

        if (vn === this._currentRootVNode) {
            this._currentRootVNode = null;
        }

        while (n.inEdges.length > 0) {
            e = n.inEdges[0] as IEdge;
            ve = e.vedge;
            this.removeVEdge(ve);
            this._graph.removeEdge(e);
        }

        while (n.outEdges.length > 0) {
            e = n.outEdges[0] as IEdge;
            ve = e.vedge;
            this.removeVEdge(ve);
            this._graph.removeEdge(e);
        }

        this.removeVNode(vn);

        this._graph.removeNode(n);

        if (this._currentRootVNode == null && _graph.noNodes > 0) {
            this._currentRootVNode = (this._graph.nodes[0] as INode).vnode;
        }

        this.refresh();
    }

    public linkNodes(v1: IVisualNode, v2: IVisualNode): IVisualEdge {

        let n1: INode;
        let n2: INode;
        let e: IEdge;
        let ve: IVisualEdge;

        if (v1 == null || v2 == null) {
            throw Error("linkNodes: one of the nodes does not exist");
        }

        n1 = v1.node;
        n2 = v2.node;

        e = this._graph.link(n1, n2, null);

        if (e == null) {
            throw Error("Could not create or find Graph edge!!");
        } else {
            if (e.vedge == null) {
                ve = this.createVEdge(e);
            } else {
                console.log("Edge already existed, returning existing vedge");
                ve = e.vedge;
            }
        }

        console.log("linkNodes, created edge " + (e as object).toString() + " from nodes: " + n1.id + ", " + n2.id);

        this.refresh();
        return ve;
    }

    public drawlinkNode(v1: IVisualNode, v2: IVisualNode, o:object): IVisualEdge {
        let n1: INode;
        let n2: INode;
        let e: IEdge;
        let ve: IVisualEdge;

        if(v1 == null || v2 == null) {
            throw Error("linkNodes: one of the nodes does not exist");
        }

        n1 = v1.node;
        n2 = v2.node;

        e = this._graph.link(n1, n2, o);

        if (e == null) {
            throw Error("Could not create or find Graph edge!!");
        } else {
            if (e.vedge == null) {
                ve = this.createVEdge(e);
            } else {
                console.log("Edge already existed, returning existing vedge");
                ve = e.vedge;
            }
        }

        console.log("linkNodes, created edge " + (e as object).toString() + " from nodes: " + n1.id + ", " + n2.id);

        this.refresh();
        return ve;
    }

    public scroll(deltaX: number, deltaY: number): void {

        let i: number;
        let children: Array<any>;
        let view: DecathlonComponent;

        children = this._canvas.getChildren();

        for (view of children) {
            // if(view != this._drawingSurface) {
                view.x += deltaX;
                view.y += deltaY;
            // }
        }

        this._origin.offset(deltaX, deltaY);
    }

    public zoom_scroll(deltaX: number, deltaY: number): void {
        // let i: number;
        // let children: Array<any>;
        // let view: DecathlonComponent;

        this._origin.offset(deltaX, deltaY);
    }

    public unlinkNodes(v1: IVisualNode, v2: IVisualNode): void {
        let n1: INode;
        let n2: INode;
        let e: IEdge;
        let ve: IVisualEdge;

        if (v1 == null || v2 == null) {
            throw Error("unlink nodes: one of the nodes does not exist");
            return;
        }

        n1 = v1.node;
        n2 = v2.node;

        e = this._graph.getEdge(n1, n2);

        if (e == null) {
            console.log("No edge found between: " + n1.id + " and " + n2.id);
            return;
        }

        ve = e.vedge;
        this.removeVEdge(ve);

        this._graph.removeEdge(e);

        console.log("removed edge: " + e.id + " : " + n1.id + " and " + n2.id);

        this.refresh();
    }

    public refresh():void {
        this._forceUpdateEdges = true;
        this._canvas.invalidateDisplayList();
    }

    public draw(): void {

        this.refresh();

        if (this._layouter &&
            this._currentRootVNode &&
            (this._graph.noNodes > 0) &&
            (this.width > 0) &&
            (this.height > 0) &&
            (this._layouter.linkLength > 0)
        ) {

            this._layouter.layoutPass();
        }

        this._canvas.invalidateDisplayList();

        this.entityDispatchEvent(new VGraphEvent(VGraphEvent.VGRAPH_CHANGED));
    }

    protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void {
        // super.updateDisplayList(unscaledWidth,unscaledHeight);
        // if(_layouter==null){
        //     _forceUpdateEdges = false;
        // }
        //
        // /* now add part to redraw edges */
        // if(_forceUpdateEdges || (_layouter && _layouter.layoutChanged)) {
        //
        //     redrawEdges();
        //     /* reset the flags */
        //     _forceUpdateEdges = false;
        //     _layouter.layoutChanged = false;
        // }
    }

    public createVNode(n: INode): IVisualNode {

        let vnode: IVisualNode;

        vnode = new VisualNode(this, n, n.id, null, n.data);

        console.log(n.data["visible"]);
        if (n.data["visible"] != null && n.data["visible"] !== "") {
            let _visible: boolean = n.data["visible"] === "true" ? true : false;
            this.setNodeVisibility(vnode, _visible);
        }

        if (this.newNodesDefaultVisible) {
            this.setNodeVisibility(vnode, true);
        }

        n.vnode = vnode;
        this._vnodes.set(vnode, vnode);

        return vnode;
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

    protected createVEdge(e: IEdge): IVisualEdge {

        let vedge: IVisualEdge;
        let n1: INode;
        let n2: INode;
        let lStyle: object;
        // let edgeAttrs:XMLList;
        // let attr:XML;
        let attname: string;
        let attrs: Array<any>;

        /* create a copy of the default style */
        lStyle = ObjectUtil.copy(this._defaultEdgeStyle);

        /* extract style data from associated XML data for each parameter */
        attrs = ObjectUtil.getClassInfo(lStyle).properties;

        for (attname of attrs) {

            if (e.data != null && (e.data)["attname"]) {
                lStyle[attname] = e.data.attname;
            }
        }

        lStyle["color"] = e.data.color;
        if (e.data["line_size"] != 0) {
            lStyle["thickness"] = e.data["line_size"];
        }
        vedge = new VisualEdge(this, e, e.id, e.data, null, lStyle);

        /* set the VisualEdge reference in the graph edge */
        e.vedge = vedge;

        /* check if the edge is supposed to be visible */
        n1 = e.node1;
        n2 = e.node2;

        /* if both nodes are visible, the edge should
         * be made visible, which may also create a label
         */
        if (n1.vnode.isVisible && n2.vnode.isVisible) {
            this.setEdgeVisibility(vedge, true);
        }

        /* add to tracking hash */
        this._vedges.set(vedge, vedge);

        return vedge;
    }

    public removeVEdge(ve: IVisualEdge): void {

        if (ve == null)
            return;

        this.setEdgeVisibility(ve, false);
        ve.edge.vedge = null;
        this._vedges.delete(ve);
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

    public redrawEdges(): void {
        let vn1: IVisualNode;
        let vn2: IVisualNode;
        let color: number;
        let vedge: IVisualEdge;
        let shapLine: DecathlonCanvas;

        /* make sure we have a graph */
        if (this._graph == null) {
            throw Error("_graph object in VisualGraph is null");
        }

        /* clear the drawing surface and remove previous
         * edges */
        this._drawingSurface.graphics.clear();
        //  var i:uint = 0;

        /* now walk through all currently visible egdes */
        for (vedge of this._visibleVEdges.values()) {

            /* get the two nodes attached to the edge */
            vn1 = vedge.edge.node1.vnode;
            vn2 = vedge.edge.node2.vnode;

            /* all nodes should be visible, so we make an assertion
             * here */
            if (!vn1.isVisible || !vn2.isVisible) {
                throw Error("One of the nodes of the checked edge is not visible, but should be!");
            }

            /* Change: we do not pass the nodes or the vnodes, but the
             * edge. The reason is that the edge can have properties
             * assigned with it that affect the drawing. */
            //	if(_edgeRenderer==null){
            let edgeClass: string = vedge.data["edge_class"];
            this._edgeRenderer = EdgeRendererFactory.getEdgeInstance(edgeClass,this);
            //	}
            this._edgeRenderer.draw(vedge);
        }
    }

    protected lookupNode(c: DecathlonComponent): IVisualNode {
        let vn: IVisualNode = this._viewToVNodeMap.get(c);
        if (vn == null) {
            throw Error("Component not in viewToVNodeMap");
        }
        return vn;
    }

    protected createVNodeComponent(vn: IVisualNode): DecathlonComponent {

        let mycomponent: DecathlonComponent = null;


        if (this._itemRendererFactory != null) {
            mycomponent = this._itemRendererFactory.newInstance();
        } else if (vn.data["node_class"] != null) {

            //mycomponent = new UIComponent();
            //mycomponent = NodeRendererFactory.getNodeInstance(vn.data.@nodeClass);

            /*let obj:Class = flash.utils.getDefinitionByName(LoadNodeClass.node_path+"."+vn.data.node_class) as Class;
            let renderer: IFactory  = new ClassFactory(obj);
            // trace(obj.id);
            //	itemRenderer = renderer;
            mycomponent = renderer.newInstance();*/

        } else {
            mycomponent = new DecathlonComponent({}, {});
        }

        // if (mycomponent is IDataRenderer) {
            (mycomponent as IDataRenderer).data = vn;
        // }

        mycomponent.x = vn.data["pos_x"];
        mycomponent.y = vn.data["pos_y"];

        /* add event handlers for dragging and double click */
        if (this._defaultDoubleClick){
            mycomponent.doubleClickEnabled = this._defaultDoubleClick;
            mycomponent.addEventListener(MouseEvent.DOUBLE_CLICK, nodeDoubleClick);
        }

        if (this._dragEnable) {

            mycomponent.addEventListener(MouseEvent.MOUSE_DOWN, nodeMouseDown);
            mycomponent.addEventListener(MouseEvent.MOUSE_UP, dragEnd);
        }

        this._canvas.addChild(mycomponent);

        /* do we have an effect set for addition of
         * items? If yes, create and start it. */
        if (this.addItemEffect != null) {
            this.addItemEffect.createInstance(mycomponent).startEffect();
        }

        vn.view = mycomponent;
        this._viewToVNodeMap.set(mycomponent, vn);

        ++this._componentCounter;

        if (this._componentCounter > this._noVisibleVNodes) {
            throw Error("Got too many components:" + this._componentCounter + " but only:" + this._noVisibleVNodes + " nodes visible");
        }

        this.refresh();
        return mycomponent;
    }

    // 动效后续处理，先默认为false
    protected removeComponent(component: DecathlonComponent, honorEffect: boolean = false): void {

        let vn: IVisualNode;

        // 动效后续处理
        // if (honorEffect && (removeItemEffect != null)) {
        //     removeItemEffect.addEventListener(EffectEvent.EFFECT_END,
        //         removeEffectDone);
        //     removeItemEffect.createInstance(component).startEffect();
        // } else {
        /* remove the component from it's parent (which should be the canvas) */
        if (component.props.owner != null) {
            component.props.owner.removeChild(component);
        }

        /* remove event mouse listeners */
        // component.removeEventListener(MouseEvent.DOUBLE_CLICK,nodeDoubleClick);
        // component.removeEventListener(MouseEvent.MOUSE_DOWN,nodeMouseDown);
        // component.removeEventListener(MouseEvent.MOUSE_UP, dragEnd);

        /* get the associated VNode and remove the view from it
         * and also remove the map entry */
        vn = this._viewToVNodeMap.get(component);
        vn.view = null;
        this._viewToVNodeMap.delete(component);

        /* decreate component counter */
        --this._componentCounter;

        //trace("removed component from node:"+vn.id);
        // }
    }

    protected createVEdgeView(ve: IVisualEdge): DecathlonComponent {
        let mycomponent: DecathlonLable = null;
        if (ve.data["is_show_name"] === 1 ) {
            if (this._edgeLabelRendererFactory != null) {
                mycomponent = this._edgeLabelRendererFactory.newInstance();
            } else {
                mycomponent = new DecathlonLable(null, null);
                // mycomponent.setStyle("textAlign", "center");
                // if (ve.data.font_color!=null && ve.data.font_color!=""){
                //     mycomponent.setStyle("color", ve.data.font_color);
                // }
                // mycomponent.buttonMode = true ;
                // mycomponent.setStyle("useHandCursor", true);
                // mycomponent.mouseChildren=false;
                if (ve.data != null && this._displayEdgeLabels) {
                    if (ve.data["edgelabel"] != null) {
                        (mycomponent as DecathlonLable).text = ve.data["edgelabel"];
                    } else {
                        (mycomponent as DecathlonLable).text = "link";
                    }
                    // mycomponent.toolTip= ve.data.edgelabel;
                    // mycomponent.doubleClickEnabled = true;
                    // mycomponent.addEventListener(MouseEvent.CLICK,onLineClick);
                }
            }

            if (mycomponent["data"]) {
                (mycomponent as IDataRenderer).data = ve;
            }

            let vn: IVisualNode;
            let count: number = 0;
            for (vn of this._visibleVNodes.values()) {
                count++;
            }

            // _canvas.addChildAt(mycomponent, count);
            this._edgeLabelEntityViews.push(mycomponent);

            ve.labelView = mycomponent;
            this._viewToVEdgeMap.set(mycomponent, ve);

            if (this._edgeRenderer != null) {
                ve.setEdgeLabelCoordinates(this._edgeRenderer.labelCoordinates(ve));
            } else {
                ve.setEdgeLabelCoordinates(new Point(this._canvas.width / 2.0, this._canvas.height / 2.0));
            }

            // refresh();
        }
        return mycomponent;
    }

    protected removeVEdgeView(component: DecathlonComponent): void {

        let ve: IVisualEdge;

        if (component.props.owner != null) {
            component.props.owner.removeChild(component);
        }

        ve = this._viewToVEdgeMap.get(component);
        ve.labelView = null;
        this._viewToVEdgeMap.delete(component);

        // --_componentCounter;

        // trace("removed component from node:"+vn.id);
    }

    protected removeEffectDone(event: EffectEvent): void {
        let mycomponent: DecathlonComponent = event.effectInstance.target as DecathlonComponent;
        this.removeComponent(mycomponent, false);
    }

    protected nodeDoubleClick(e: MouseEvent): void {
        let comp: DecathlonComponent;
        let vnode: IVisualNode;

        comp = (e.target as DecathlonComponent);

        vnode = this.lookupNode(comp);

        this.currentRootVNode = vnode;
        this.maxVisibleDistance = vnode.data["open_deep"];
        console.log("currentVNode:" + this.currentRootVNode.id);

        this.draw();
    }

    public nodeMouseDown(e: MouseEvent): void {
        this.toolTip = null;
        if (this._defaultDragAllNode){
            let evnode: IVisualNode;
            let mycomponent: DecathlonComponent;
            const mpoint: Point = globalMousePosition();
            let pt: Point;

            if (this._layouter != null) {
                if (this._layouter.animInProgress) {
                    console.log("Animation in progress, drag attempt ignored");
                    return;
                }
            }

            if (e.target is DecathlonComponent) {
                this._backgroundDragInProgress = false;

                e.stopImmediatePropagation();
                this._dragCursorStartX = mpoint.x;
                this._dragCursorStartY = mpoint.y;
                /* register the backgroundDrag listener to react to
                     * the mouse movements */
                /*	mycomponent.addEventListener(MouseEvent.MOUSE_MOVE, backgroundDragContinue);*/
                let ecomponent: DecathlonComponent = (e.target as DecathlonComponent);
                evnode = this._viewToVNodeMap.get(ecomponent);
                this._dragComponent = ecomponent;
                ecomponent.stage.addEventListener(MouseEvent.MOUSE_MOVE, handleDrag2);
                /* and inform the layouter about the dragEvent */
                if (this._layouter != null) {
                    this._layouter.dragEvent(e, evnode);
                }
            }
        } else {
            this.his_mouse_point.x = this.contentMouseX;
            this.his_mouse_point.y = this.contentMouseY;
            this.dragBegin(e);
        }
    }

    private canvasKeyDown(event: KeyboardEvent): void{
        //向上箭头事件处理 y-10
        let step: number = 1;
        let node: IVisualNode;
        if (event.keyCode.toString() == "38"){
            if (this._configMoveNodes !== null){
                for (node of this._configMoveNodes.values()) {
                    node.view.y = node.view.y - step;
                }
            }
        }
        //向下箭头事件处理  y+10
        if (event.keyCode.toString() == "40") {
            if (this._configMoveNodes!==null){
                for (node of this._configMoveNodes.values()) {
                    node.view.y = node.view.y + step;
                }
            }
        }
        //向左箭头事件处理 x-10
        if (event.keyCode.toString() == "37"){
            if (this._configMoveNodes !== null){
                for (node of this._configMoveNodes.values()) {
                    node.view.x = node.view.x - step;
                }
            }
        }
        //向右箭头事件处理 x+10
        if (event.keyCode.toString() == "39"){
            if (this._configMoveNodes !== null){
                for (node of this._configMoveNodes.values()) {
                    node.view.x = node.view.x + step;
                }
            }
        } else {
            if (event.shiftKey){//全选组合,由于Ctrl+A 功能健,无法用Ctrl+A组合,这里用shift+A组合
                if (event.keyCode == 65){
                    this._configMoveNodes = this._visibleVNodes;
                    for (node of this._configMoveNodes.values()) {
                        node.view.alpha = 0.3;
                    }
                }
            }
        }
        this.refresh();
    }

    public dragBegin(event: EntityMouseEvent): void {

        let ecomponent: DecathlonComponent;
        let evnode: IVisualNode;
        let pt: Point;

        if (this._layouter != null) {
            if (this._layouter.animInProgress) {
                console.log("Animation in progress, drag attempt ignored");
                return;
            }
        }

        if (event.target is DecathlonComponent) {
            ecomponent = (event.target as DecathlonComponent);

            evnode = this._viewToVNodeMap.get(ecomponent);

            // event.stopImmediatePropagation();

            if (evnode != null) {
                if (!this.dragLockCenter) {
                    pt = ecomponent.localToGlobal(new Point(ecomponent.mouseX, ecomponent.mouseY));
                } else {
                    pt = ecomponent.localToGlobal(new Point(0,0));
                }

                this._drag_x_offsetMap.set(ecomponent, pt.x / scaleX - ecomponent.x);
                this._drag_y_offsetMap.set(ecomponent, pt.y / scaleY - ecomponent.y);

                this._dragComponent = ecomponent;
                //if(_dragEnable){
                ecomponent.stage.addEventListener(MouseEvent.MOUSE_MOVE, this.handleDrag);
                //  }

                if (this._layouter != null) {
                    this._layouter.dragEvent(event, evnode);
                }
            } else {
                throw Error("Event Component was not in the viewToVNode Map");
            }
        } else {
            throw Error("MouseEvent target was no UIComponent");
        }
    }

    public dragEnd(event: EntityMouseEvent): void {

        let mycomp: DecathlonComponent;
        let myback: DecathlonComponent;
        let myvnode: IVisualNode;

        if (this._backgroundDragInProgress) {

            this._backgroundDragInProgress = false;
            myback = (this as DisplayObject);

            /* unregister event handler */
            myback.removeEventListener(MouseEvent.MOUSE_MOVE, this.backgroundDragContinue);
            // myback.removeEventListener(MouseEvent.MOUSE_MOVE,dragEnd);

            /* and inform the layouter about the dropEvent */
            if (this._layouter != null){
                this._layouter.bgDropEvent(event);
            }
        } else {
            mycomp = this._dragComponent;

            if (mycomp == null) {
                console.log("dragEnd: received dragEnd but _dragComponent was null, ignoring");
                return;
            }

            if (mycomp.stage != null) {
                if (this._defaultDragAllNode) {
                    mycomp.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.handleDrag2);
                } else {
                    mycomp.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.handleDrag);
                }
            }

            myvnode = this._viewToVNodeMap.get(mycomp);
            myvnode.x = mycomp.x;
            myvnode.y = mycomp.y;
            if (this._layouter != null){
                this._layouter.dropEvent(event, myvnode);
            }
            /* reset the dragComponent */
            this._dragComponent = null;
        }

        event.target.stopImmediatePropagation();
    }

    protected handleDrag(event: EntityMouseEvent): void {
        let myvnode: IVisualNode;
        let sp: DecathlonComponent;

        sp = this._dragComponent;

        if (this._dragComponent == null) {
            console.log("received handleDrag event but _dragComponent is null, ignoring");
            return;
        }

        if (this._moveNodeInDrag) {
            sp.x = event.stageX / scaleX - this._drag_x_offsetMap.get(sp);
            sp.y = event.stageY / scaleY - this._drag_y_offsetMap.get(sp);
        }

        myvnode = this._viewToVNodeMap.get(this._dragComponent);
        if (this._layouter != null) {
            this._layouter.dragContinue(event, myvnode);
            if (this._configMoveNodes != null) {
                for (let node: IVisualNode of this._configMoveNodes.values()) {
                    node.view.x = node.view.x + (this.contentMouseX - this.his_mouse_point.x);
                    node.view.y = node.view.y + (this.contentMouseY - this.his_mouse_point.y);
                }
            }
            this.refresh();
        }
        event.updateAfterEvent();
        this.his_mouse_point.x = this.contentMouseX;
        this.his_mouse_point.y = this.contentMouseY;
    }

    public handleDrag2(event: EntityMouseEvent): void {

        const mpoint: Point = this.globalMousePosition();

        let deltaX: number;
        let deltaY: number;

        if (this._scrollBackgroundInDrag) {

            deltaX = mpoint.x - this._dragCursorStartX;
            deltaY = mpoint.y - this._dragCursorStartY;

            deltaX /= this.scaleX;
            deltaY /= this.scaleY;

            scroll(deltaX, deltaY);
        }

        if (this._layouter != null){
            this._layouter.bgDragContinue(event);
        }

        this._dragCursorStartX = mpoint.x;
        this._dragCursorStartY = mpoint.y;

        this.refresh();
    }

    protected backgroundDragBegin(event: EntityMouseEvent): void {

        let mycomponent: DecathlonComponent;
        const mpoint: Point = this.globalMousePosition();

        if (this._layouter != null){
            if (this._layouter.animInProgress) {
                console.log("Animation in progress, drag attempt ignored");
                return;
            }
        }

        mycomponent = (this as UIComponent);

        this._backgroundDragInProgress = true;

        this._dragCursorStartX = mpoint.x;
        this._dragCursorStartY = mpoint.y;

        if (this._defaultDragBackBound) {
            mycomponent.addEventListener(MouseEvent.MOUSE_MOVE, this.backgroundDragContinue);
        }

        if (this._layouter != null) {
            this._layouter.bgDragEvent(event);
        }
    }

    protected backgroundDragContinue(event: EntityMouseEvent): void {

        const mpoint: Point = this.globalMousePosition();

        let deltaX: number;
        let deltaY: number;

        if (this._scrollBackgroundInDrag) {

            deltaX = mpoint.x - this._dragCursorStartX;
            deltaY = mpoint.y - this._dragCursorStartY;

            deltaX /= this.scaleX;
            deltaY /= this.scaleY;

            scroll(deltaX, deltaY);
        }

        if (this._layouter != null) {
            this._layouter.bgDragContinue(event);
        }

        this._dragCursorStartX = mpoint.x;
        this._dragCursorStartY = mpoint.y;

        this.refresh();
    }

    public backgroundDragInit(first: boolean = false): number {
        let items: Array<any> = this._canvas.getChildren();
        let min_x: number = 4000;
        let max_x: number = 0;
        let max_w: number = 0;
        let min_y: number = 4000;
        let max_y: number = 0;
        let max_h: number = 0;
        for (let ui:DecathlonComponent of items){
            if (ui != this._drawingSurface){

                if (ui.x + ui.width >= max_x) {
                    max_x = ui.x + ui.width;
                }

                if (ui.x <= min_x && ui.x != 0) {
                    min_x = ui.x;
                }

                if (ui.y + ui.height >= max_y) {
                    max_y = ui.y + ui.height;
                }

                if (ui.y <= min_y && ui.y != 0) {
                    min_y = ui.y;
                }

            }
        }

        let center_x: number = this.center.x / this.scaleX;
        let center_y: number = this.center.y / this.scaleY;

        let center_width: number = Math.floor(center_x - (max_x - min_x) / 2 - min_x);
        let center_height: number = Math.floor(center_y - (max_y - min_y) / 2 - min_y);

        if (max_x < this.width && center_width != 0) {
            const mpoint: Point = new Point(this.center.x, this.center.y);

            let deltaX: number;
            let deltaY: number;

            if (this._scrollBackgroundInDrag) {
                if (first) {
                    deltaX = center_width;
                    deltaY = max_y < center_y * 2 ? center_height : 0;
                }else{
                    deltaX = mpoint.x - this._dragCursorStartX;
                    deltaY = mpoint.y - this._dragCursorStartY;
                }

                for (let view: DecathlonComponent of items) {
                    if (view != this._drawingSurface) {
                        view.x += deltaX;
                        view.y += deltaY;
                    }
                }

                this._origin.offset(deltaX,deltaY);
            }

            this._dragCursorStartX = mpoint.x;
            this._dragCursorStartY = mpoint.y;

            this.refresh();
        } else {
            center_width = 0;
        }

        return center_width;
    }

    public backgroundDragClickNode(first: boolean = false, orginX: number = 0, orginY: number = 0): number {

        let items: Array<any> =	this._canvas.getChildren();
        let offsetX: number = 0;
        let offsetY: number = 0;

        let center_x: number = this.center.x / this.scaleX;
        let center_y: number = this.center.y / this.scaleY;

        offsetX = center_x - orginX;
        offsetY = center_y - orginY;

        const mpoint:Point = new Point(this.center.x, this.center.y);

        var deltaX: number;
        var deltaY: number;

        if (this._scrollBackgroundInDrag) {
            if (first){
                deltaX = offsetX;
                deltaY = offsetY;
            } else {
                deltaX = mpoint.x - this._dragCursorStartX;
                deltaY = mpoint.y - this._dragCursorStartY;
            }

            for (let view: DecathlonComponent of items) {
                if (view != this._drawingSurface) {
                    view.x += deltaX;
                    view.y += deltaY;
                }
            }

            this._origin.offset(deltaX, deltaY);
        }

        this._dragCursorStartX = mpoint.x;
        this._dragCursorStartY = mpoint.y;

        this.refresh();

        return 0;
    }

    public globalMousePosition(): Point {
        return localToGlobal(new Point(mouseX, mouseY));
    }

    protected setDistanceLimitedNodeIds(vnids: Map<INode, INode>): void {
        let val: boolean;
        let amount: number;
        let vn: IVisualNode;
        let n: INode;

        amount = 0;

        this._prevNodeIDsWithinDistanceLimit = this._nodeIDsWithinDistanceLimit;
        this._nodeIDsWithinDistanceLimit = new Map<IVisualNode, IVisualNode>();

        for (n of vnids.values()) {
            vn = n.vnode;
            this._nodeIDsWithinDistanceLimit.set(vn, vn);

            ++amount;
        }

        for (val of vnids.values()) {
            if (val) {
                ++amount;
            }
        }

        this._noNodesWithinDistance = amount;
    }

    public updateVisibility(): void {
        let n: INode;
        let e: IEdge;
        let edges: Array<any>;
        let treeparents: Map<INode, INode>;
        let vn: IVisualNode;
        let vno: IVisualNode;
        let pvn: IVisualNode;
        let newVisibleNodes: Map<IVisualNode, IVisualNode>;
        let toInvisibleNodes: Map<IVisualNode, IVisualNode>;

        if (this._layouter != null) {
            this._layouter.resetAll();
        }

        toInvisibleNodes = new Map<IVisualNode, IVisualNode>();
        for (vn in this._visibleVNodes.values()) {
            toInvisibleNodes.set(vn, vn);
        }

        newVisibleNodes = new Map<IVisualNode, IVisualNode>();

        for (vn in this._nodeIDsWithinDistanceLimit.values()) {
            newVisibleNodes.set(vn, vn);
        }

        if (this._showCurrentNodeHistory) {

            treeparents = this._graph.getTree(this._currentRootVNode.node, false, false).parents;

            for (vn of this._currentVNodeHistory.values()) {
                n = vn.node;

                while (n.vnode != this._currentRootVNode) {

                    newVisibleNodes.set(n.vnode, n.vnode);
                    n = treeparents.get(n);
                    if (n == null) {
                        throw Error("parent node was null but node was not root node");
                    }
                }
            }
        }

        for (vn of toInvisibleNodes.values()) {
            if (newVisibleNodes.get(vn) != null) {
                toInvisibleNodes.delete(vn);
                newVisibleNodes.delete(vn);
            }
        }

        for (vn of toInvisibleNodes.values()) {
            this.setNodeVisibility(vn, false);
        }

        for (vn of newVisibleNodes.values()) {
            this.setNodeVisibility(vn, true);
        }

        this.setAllEdgesInVisible();
        this.updateEdgeVisibility();
    }

    public setAllVisible(): void {
        let n: INode;
        let e: IEdge;

        if (this._graph == null) {
            console.log("setAllVisible() called, but graph is null");
            return;
        }

        if (this._layouter != null) {
            this._layouter.resetAll();
        }

        this._visibleVNodes = new Map<IVisualNode, IVisualNode>();
        this._noVisibleVNodes = 0;

        for (n of this._graph.nodes) {
            this.setNodeVisibility(n.vnode, true);
        }

        this._visibleVEdges = new Map<IVisualEdge, IVisualEdge>();

        for (e of this._graph.edges) {
            this.setEdgeVisibility(e.vedge, true);
        }
    }

    protected setAllInVisible(): void {
        let vn: IVisualNode;
        let ve: IVisualEdge;

        if (this._graph == null) {
            console.log("setAllInVisible() called, but graph is null");
            return;
        }

        if (this._layouter != null) {
            this._layouter.resetAll();
        }

        for (vn of this._visibleVNodes.values()) {
            this.setNodeVisibility(vn, false);
        }

        for (ve of this._visibleVEdges.values()) {
            this.setEdgeVisibility(ve, false);
        }
    }

    public setAllEdgesInVisible(): void {
        let ve: IVisualEdge;
        for (ve of this._visibleVEdges.values()) {
            this.setEdgeVisibility(ve, false);
        }
    }

    public setNodeVisibility(vn: IVisualNode, visible: boolean): void {

        let comp: DecathlonComponent;

        if (vn.isVisible == visible) {
            console.log("Tried to set node:" + vn.id + " visibility to:" + visible.toString() + " but it was already.");
            return;
        }

        if (visible) {
            vn.isVisible = true;
            this._visibleVNodes.set(vn, vn);

            ++this._noVisibleVNodes;

            comp = this.createVNodeComponent(vn);

            comp.visible = true;
            console.log(comp.width);
        } else {
            vn.isVisible = false;

            this._visibleVNodes.delete(vn);
            --this._noVisibleVNodes;

            if (vn.view != null) {
                this.removeComponent(vn.view, false);
            }
        }
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

    public updateConnectedEdgesVisibility(vn: IVisualNode): void {
        let edges: Array<any>;
        let ovn: IVisualNode;
        let e: IEdge;

        edges = vn.node.inEdges;

        edges = edges.concat(vn.node.outEdges);

        for (e of edges) {
            ovn = e.othernode(vn.node).vnode;

            if (vn.isVisible && ovn.isVisible) {
                this.setEdgeVisibility(e.vedge,true);
            } else {
                this.setEdgeVisibility(e.vedge, false);
            }
        }
    }

    public refreshVnode(vn: IVisualNode): void {
        if (vn != null) {
            if (this._visibilityLimitActive) {
                this.setDistanceLimitedNodeIds(this._graph.getTree(vn.node, false, false).getLimitedNodes(2));
                this.updateSubNodeVisibility(vn);
            } else {
                this.draw();
            }
        }
    }

    public closeSubVnode(vn: IVisualNode): void {
        if (vn != null) {
            if (this._visibilityLimitActive) {
                this.closeSubNodeVisibility(vn);
            } else {
                this.draw();
            }
        }
    }

    protected updateSubNodeVisibility(root: IVisualNode): void {
        let n: INode;
        let e: IEdge;
        let edges: Array<any>;
        // let treeparents: Dictionary;
        let vn: IVisualNode;
        let vno: IVisualNode;
        let pvn: IVisualNode
        let newVisibleNodes: Map<IVisualNode, IVisualNode>;
        // let toInvisibleNodes: Dictionary;

        if (this._layouter != null) {
            this._layouter.resetAll();
        }

        newVisibleNodes = new Map<IVisualNode, IVisualNode>();

        let vnArray: Array<any> = this._graph.getTree(root.node, false, false).getChildren(root.node);

        for (n of vnArray){
            let vn: IVisualNode = n.vnode ;
            newVisibleNodes.set(vn, vn);
        }

        for (vn of newVisibleNodes.values()) {
            this.setNodeVisibility(vn, true);
        }

        this.setAllEdgesInVisible();
        this.updateEdgeVisibility();

        console.log("currentVNode:" + this.currentRootVNode.id);

        this.draw();
    }

    protected closeSubNodeVisibility(root: IVisualNode): void {
        // let n: INode;
        // let e: IEdge;
        // let edges:Array;
        // let treeparents:Dictionary;
        // let vn:IVisualNode;
        // let vno:IVisualNode;
        // let pvn:IVisualNode
        // let newVisibleNodes:Dictionary;
        // let tovisibleNodes:Dictionary;

        if (this._layouter != null) {
            this._layouter.resetAll();
        }

        this.setNodeChildrenVisibility(root, false);

        this.setAllEdgesInVisible();

        this.updateEdgeVisibility();

        console.log("currentVNode:" + this.currentRootVNode.id);

        this.draw();
    }

    public set dragEnable(value: boolean):void{
        this._dragEnable = value;

        let vn: IVisualNode;

        if (value) {
            for (vn of this.visibleVNodes.values()) {
                vn.view.addEventListener(MouseEvent.MOUSE_DOWN, this.nodeMouseDown);
                vn.view.addEventListener(MouseEvent.MOUSE_UP, this.dragEnd);
            }
        } else {
            for (vn of this.visibleVNodes.values()) {
                vn.view.removeEventListener(MouseEvent.MOUSE_DOWN, this.nodeMouseDown);
                vn.view.removeEventListener(MouseEvent.MOUSE_UP, this.dragEnd);
            }
        }
    }

    private setNodeChildrenVisibility(root: IVisualNode, flag: boolean): void {
        let vnArray: Array<any> = this._graph.getTree(root.node, false, false).getChildren(root.node);
        let n: INode;
        for (n of vnArray ){
            let vn: IVisualNode = n.vnode ;
            this.setNodeChildrenVisibility(vn, flag)
            this.setNodeVisibility(n.vnode, flag);
        }
    }

    public get newNodesVisible(): boolean{
        return this._newNodesDefaultVisible;
    }

    public set newNodesVisible(s: boolean) {
        this._newNodesDefaultVisible = s;
    }
    public get mulriSelectNodes(): Map<IVisualNode, IVisualNode> {
        return this._configMoveNodes;
    }

    public set mulriSelectNodes(value: Map<IVisualNode, IVisualNode>) {
        this._configMoveNodes = value;
    }

    public get isDrawLine(): boolean{
        return this._isDrawLine;
    }

    public set isDrawLine(s: boolean) {
        this._isDrawLine = s;
    }

    public get isMouseEnterFirst(): boolean{
        return this._isMouseEnterFirst;
    }
    public set isMouseEnterFirst(s: boolean) {
        this._isMouseEnterFirst = s;
    }

    // public reloadData(xmldata:XML):void{
    //     var rgraph:IGraph = new Graph("XMLAsDocsGraph",true,xmldata);
    //
    //     this.graph = rgraph ;
    //
    //     this.currentRootVNode = graph.nodes[0].vnode;
    //
    //     this.draw();
    // }

    public set changeVerticalScrollPosition(position: number) {
        this.verticalScrollPosition = position;
    }

    public set changeHorizontalScrollPosition(position: number) {
        this.horizontalScrollPosition = position;
    }

    public set backgroundDragInProgress(value: boolean) {
        this._backgroundDragInProgress = value;
    }

    public get backgroundDragInProgress(): boolean {
        return this._backgroundDragInProgress;
    }

    public set dragCursorStartX(value: number) {
        this._dragCursorStartX = value;
    }

    public get dragCursorStartX(): number {
        return this._dragCursorStartX ;
    }

    public set dragCursorStartY(value: number) {
        this._dragCursorStartY = value;
    }

    public get dragCursorStartY(): number {
        return this._dragCursorStartY ;
    }

    public get viewToVNodeMap(): Map<DecathlonComponent, IVisualNode> {
        return this._viewToVNodeMap;
    }

    public set dragComponent(value: DecathlonComponent) {
        this._dragComponent = value;
    }

    public get dragComponent(): DecathlonComponent {
        return this._dragComponent ;
    }

    public set isLineTopShow(value: boolean) {
        this._isLineTopShow = value;
    }

    public get isLineTopShow(): boolean {
        return this._isLineTopShow ;
    }

    public set drawingSurface(value: DecathlonComponent) {
        this._drawingSurface = value;
    }

    public get drawingSurface(): DecathlonComponent {
        return this._drawingSurface;
    }

    render() {
        return(
            <DecathlonCanvas getEntity={(mainDiv) => {this._canvas = mainDiv}}>
                {
                    this.state["edgeLabelChildren"].map((item, key) => {
                        const EdgeLabelChildrenComponent = item;
                        return < EdgeLabelChildrenComponent key={key} />;
                    })
                }
                <svg id="edgeSvg">
                    {
                        this.state["edgeChildren"].map((item, key) => {
                            const EdgeChildrenComponent = item;
                            return < EdgeChildrenComponent key={key} />;
                        })
                    }
                </svg>
                {
                    this.state["nodeLabelChildren"].map((item, key) => {
                        const NodeLabelChildren = item;
                        return < NodeLabelChildren key={key} />;
                    })
                }
                {
                    this.state["nodeChildren"].map((item, key) => {
                        const NodeChildrenComponent = item;
                        return < NodeChildrenComponent key={key} />;
                    })
                }
            </DecathlonCanvas>
        );
    }
}