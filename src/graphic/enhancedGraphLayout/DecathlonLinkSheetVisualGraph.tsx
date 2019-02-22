import {DecathlonCanvas} from "../../workflow/components/DecathlonCanvas";
import {DecathlonComponent, IDecathlonComponentProps} from "../../workflow/components/DecathlonComponent";
import * as React from "react";
import {INode} from "../graphLayout/data/INode";
import {IEdge} from "../graphLayout/data/IEdge";
import {Point} from "../../base/Point";
import {LinkSheetDataUtil} from "../utils/LinkSheetDataUtil";
import {IComponentFactory} from "../../workflow/global/IComponentFactory";
import {StepContainer} from "./StepContainer";
import {ComponentFactory} from "../../workflow/global/ComponentFactory";
import {CommConst} from "../consts/CommConst";
import "./DecathlonLinkSheetVisualGraph.scss";
import {LinkSheetHeaderEvent} from "../../events/LinkSheetHeaderEvent";
import {LinkSheetNodeRenderer} from "./nodeRenderers/LinkSheetNodeRenderer";
import {LinkSheetGraph} from "../graphLayout/data/LinkSheetGraph";
import {IVisualNode} from "../graphLayout/visual/IVisualNode";
import {IVisualEdge} from "../graphLayout/visual/IVisualEdge";
import {VisualNode} from "../graphLayout/visual/VisualNode";
import {VisualEdge} from "../graphLayout/visual/VisualEdge";
import {BaseEdgeRenderer} from "../graphLayout/visual/edgeRenderers/BaseEdgeRenderer";
import {IEdgeRenderer} from "../graphLayout/visual/IEdgeRenderer";
import {EntityMouseEvent} from "../../workflow/events/EntityMouseEvent";
import {BaseNodeRenderer} from "../graphLayout/visual/nodeRenderers/BaseNodeRenderer";
import {VisualNodeEvent} from "../../events/VisualNodeEvent";
import {VisualGraphEvent} from "../../events/VisualGraphEvent";
import {LinkSheetConst} from "../consts/LinkSheetConst";
import {IVisualGraph} from "../graphLayout/visual/IVisualGraph";
import {ILayoutAlgorithm} from "../graphLayout/layout/ILayoutAlgorithm";
import {LinkSheetNodeEvent} from "../../events/LinkSheetNodeEvent";


export class DecathlonLinkSheetVisualGraph extends DecathlonComponent implements IVisualGraph {
    protected _origin: Point;
    private _canvas: DecathlonCanvas<IDecathlonComponentProps>;
    private _stepRendererFactory: IComponentFactory;
    private _nodeRendererFactory: IComponentFactory;
    protected _graph: LinkSheetGraph;
    protected _vnodes: Map<VisualNode, VisualNode>;
    protected _vedges: Map<IVisualEdge, IVisualEdge>;
    protected _edgeViewToVEdgeMap: Map<BaseEdgeRenderer, IVisualEdge>;
    protected _visibleVEdges: Map<IVisualEdge, IVisualEdge>;
    protected _visibleVNodes: Map<IVisualNode, IVisualNode>;
    protected _visibleVEdgesList: Array<IVisualEdge>;
    protected _displayEdgeLabels: boolean = true;
    protected _edgeRendererFactory: ComponentFactory;
    protected _nodeViewToVNodeMap: Map<DecathlonComponent, IVisualNode>;
    protected _visibleVNodesList: Array<IVisualNode>;
    protected _noVisibleVNodes: number;
    protected _nodeMovedInDrag: boolean = false;
    protected isNodeTransformCompassMouseDown: boolean = false;
    protected _backgroundDragInProgress: boolean = false;
    protected graphState: string = LinkSheetConst.GRAPH_STATE;
    public selectedNode: INode;
    public selectedEdge: IEdge;
    public currentRootVNode: IVisualNode;
    public currentSeletedNodeRenderer: LinkSheetNodeRenderer;
    public itemRenderer: IComponentFactory;
    public edgeRenderer: IComponentFactory;
    public edgeLabelRenderer: IComponentFactory;
    public displayEdgeLabels: boolean;
    public layouter: ILayoutAlgorithm;
    public center: Point;
    public showHistory: boolean;
    public visibilityLimitActive: boolean;
    public maxVisibleDistance: number;

    constructor(props, context) {
        super(props, context);
        this.state = {
            stepsElement: [],
            nodesElement: [],
            edgesElement: [],
            refresh: false
        };

        this._origin = new Point(0, 0);
        this._visibleVNodes = new Map<IVisualNode, IVisualNode>();
        this._visibleVNodesList = [];
        this._nodeViewToVNodeMap = new Map<DecathlonComponent, IVisualNode>();
        this._vnodes = new Map<VisualNode, VisualNode>();
    }

    componentWillMount() {
        console.log("初始化调用接口攞数据");
        this.init();
    }

    componentDidMount() {
        // this.init();
        console.log("vg init");
    }

    public clearHistory(): void {}

    public get visibleVNodes(): Map<IVisualNode, IVisualNode> {
        return this._visibleVNodes;
    }

    public get visibleVEdges(): Map<IVisualEdge, IVisualEdge> {
        return this._visibleVEdges;
    }

    public get noVisibleVNodes(): number {
        return this._noVisibleVNodes;
    }

    public get origin(): Point {
        return this._origin;
    }

    public set graph(g: LinkSheetGraph) {
        this._graph = g;
    }

    public get graph(): LinkSheetGraph {
        return this._graph;
    }

    public get edgeRendererFactory(): ComponentFactory {
        return this._edgeRendererFactory;
    }

    protected initGraphEventListener(): void {
        this.entityAddEventListener(LinkSheetNodeEvent.NODE_MOUSE_DOWN, this.onNodeMouseHandler, this);
    }

    protected onNodeMouseHandler(event: LinkSheetNodeEvent): void {
        switch (event.type) {
            case LinkSheetNodeEvent.NODE_MOUSE_DOWN:
                let ecomponent: DecathlonComponent = event.target;

                if (this._nodeMovedInDrag) {
                    return;
                }

                let evnode: IVisualNode = this._nodeViewToVNodeMap.get(ecomponent);

                if (evnode != null) {
                    if (this.selectedNode != null) {
                        if (this.selectedNode.vnode != null)
                            this.selectedNode.vnode.view.isSelected = false;
                    }

                    this.selectedNode = evnode.node;

                    this.selectedNode.vnode.view.isSelected = true;
                    // node view z 位置深度
                }

                if (this.selectedEdge != null) {
                    let edgeView: BaseEdgeRenderer = this.selectedEdge.vedge.edgeView;
                    edgeView.unSelectedEdge();
                }

                this.selectedEdge = null;

                this.entityAddEventListener(EntityMouseEvent.MOUSE_MOVE, this.onMouseEventHandler, this);
                this.entityAddEventListener(EntityMouseEvent.MOUSE_UP, this.onMouseEventHandler, this);
                break;
        }
    }

    protected onMouseEventHandler(event: EntityMouseEvent): void {
        switch (event.type) {
            case EntityMouseEvent.MOUSE_MOVE:
                if (this.graphState === LinkSheetConst.GRAPH_STATE) {
                    if (this.selectedNode == null)
                        return;
                } else {
                    console.log("划线");
                }
                break;
            case EntityMouseEvent.MOUSE_UP:
                break;
        }
    }

    public initFromGraph(): void {
        // if (this._graph != null) {
        //     this.purgeVGraph();
        // }
        let node: INode;
        let edge: IEdge;

        for (node of this._graph.nodes) {
            this.createVNode(node);
        }

        for (edge of this._graph.edges) {
            this.createVEdge(edge);
        }

        this.setState({nodesElement: this._graph.nodes});
        this.initGraphEventListener();
    }

    public createNode(sid: string = "", o: object = null): IVisualNode {
        let gnode: INode;
        let vnode: IVisualNode;

        gnode = this._graph.createNode(sid, o);

        vnode = this.createVNode(gnode);

        return vnode;
    }

    public removeNode(vn: IVisualNode): void {
        let n: INode;
        let e: IEdge;
        let ve: IVisualEdge;
        let i: number;

        n = vn.node;

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

        // this.removeVNode(vn);

        this._graph.removeNode(n);

        // if (_currentRootVNode == null && _graph.noNodes > 0) {
        //     _currentRootVNode = (_graph.nodes[0] as INode).vnode;
        // }
        //
        // refresh();
    }

    public linkNodes(v1: IVisualNode, v2: IVisualNode): IVisualEdge {

        let n1: INode;
        let n2: INode;
        let e: IEdge;
        let ve: IVisualEdge;

        /* make sure both nodes do exist */
        if (v1 == null || v2 == null) {
            throw Error("linkNodes: one of the nodes does not exist");
            // return null;
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
                ve = e.vedge;
            }
        }

        // refresh();
        return ve;
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
            return;
        }

        ve = e.vedge;
        this.removeVEdge(ve);

        this._graph.removeEdge(e);

        // refresh();
    }

    protected createVNode(n: INode): IVisualNode {

        let vnode: VisualNode;

        vnode = new VisualNode(this, n, n.id, null, n.data);

        this.setNodeVisibility(vnode, true);

        n.vnode = vnode;

        this._vnodes.set(vnode, vnode);

        return vnode;
    }

    public refresh(): void {}

    public draw(flags: number): void {}

    public redrawEdges(): void {}

    public refreshVnode(vn: IVisualNode): void {}

    public closeSubVnode(vn: IVisualNode): void {}

    public scroll(sx: number, sy: number, reset: boolean): void {}

    public handleDrag2(event: EntityMouseEvent): void {}

    public updateConnectedEdgesVisibility(vn: IVisualNode): void {}
    public calcNodesBoundingBox(): any { return null; }

    public setNodeVisibility(vn: IVisualNode, visible: boolean): void {

        let comp: DecathlonComponent;

        if (vn.isVisible === visible) {
            return;
        }

        if (visible) {

            vn.isVisible = true;

            this._visibleVNodes.set(vn, vn);

            if (this._visibleVNodesList.indexOf(vn) === -1)
                this._visibleVNodesList.push(vn);

            ++this._noVisibleVNodes;

            comp = this.createVNodeComponent(vn);

            comp.visible = true;

        } else {
            this.deleteVisibleVNode(vn);
        }
    }

    protected createVNodeComponent(vn: IVisualNode): DecathlonComponent {
        let mycomponent: DecathlonComponent = null;

        if (this._nodeRendererFactory != null) {
            mycomponent = this._nodeRendererFactory.newInstance();
        } else {
            mycomponent = new LinkSheetNodeRenderer(null, null);
        }

        mycomponent.data = vn;

        mycomponent.x = this.width / 2.0;
        mycomponent.y = this.height / 2.0;

        mycomponent.doubleClickEnabled = true;
        // mycomponent.entityAddEventListener(EntityMouseEvent.DOUBLE_CLICK, this.nodeDoubleClick, this);
        // mycomponent.entityAddEventListener(EntityMouseEvent.MOUSE_DOWN, this.nodeMouseDown, this);
        // mycomponent.entityAddEventListener(EntityMouseEvent.MOUSE_OVER, this.nodeRollOver, this);
        // mycomponent.addEventListener(MouseEvent.ROLL_OUT, nodeRollOut,false,0,true);
        // mycomponent.entityAddEventListener(EntityMouseEvent.CLICK, this.nodeMouseClick, this);

        // nodeLayer.addChild(mycomponent);
        // 动效暂时不做
        // if (addItemEffect != null) {
        //     addItemEffect.createInstance(mycomponent).startEffect();
        // }

        vn.view = mycomponent;
        this._nodeViewToVNodeMap.set(mycomponent, vn);
        //
        // refresh();
        return mycomponent;
    }

    protected addNodeChild(addComponent: DecathlonComponent): void {

    }

    protected purgeVGraph(): void {
        let ves: Array<IVisualEdge> = [];
        let vns: Array<VisualNode> = [];
        let ve: IVisualEdge;
        let vn: VisualNode;

        for (let ve of this._vedges.values()) {
            ves.unshift(ve);
        }
        for (let vn of this._vnodes.values()) {
            vns.unshift(vn);
        }

        if (this._graph != null) {
            for (ve of ves) {
                this.removeVEdge(ve);
            }
            for (let vn of vns) {
                this.removeVNode(vn);
            }
        }
    }

    public removeVNode(vn: VisualNode): void {

        let view: DecathlonComponent;

        view = vn.rawview;

        vn.view = null;

        vn.node.vnode = null;

        if (view != null)
            this.removeNodeView(view);

        if (this._visibleVNodes.get(vn) !== undefined)
            this.deleteVisibleVNode(vn);

        this._vnodes.delete(vn);
    }

    private deleteVisibleVNode(vn: IVisualNode): void {
        vn.isVisible = false;
        this._visibleVNodes.delete(vn);
        let newVisibleVNodes: Array<IVisualNode> = [];
        for (let visualNode of this._visibleVNodesList) {
            if (visualNode !== vn)
                newVisibleVNodes.push(visualNode);
        }

        this._visibleVNodesList = newVisibleVNodes;

        if (vn.view != null) {
            this.removeNodeView(vn.view);
        }

        --this._noVisibleVNodes;
    }

    protected removeNodeView(component: DecathlonComponent): void {
        let vn: IVisualNode;

        // 待续
        // if (component.parent != null) {
        //     component.parent.removeChild(component);
        // }

        component.entityRemoveEventListener(EntityMouseEvent.DOUBLE_CLICK, this.nodeDoubleClick);
        component.entityRemoveEventListener(EntityMouseEvent.MOUSE_DOWN, this.nodeMouseDown);
        component.entityRemoveEventListener(EntityMouseEvent.CLICK, this.nodeMouseClick);
        component.entityRemoveEventListener(EntityMouseEvent.MOUSE_UP, this.dragEnd);

        vn = this._nodeViewToVNodeMap.get(component);
        vn.view = null;
        this._nodeViewToVNodeMap.delete(component);
    }

    protected lookupNode(c: DecathlonComponent): IVisualNode {
        let vn: IVisualNode = this._nodeViewToVNodeMap.get(c);
        if (vn == null) {
            throw Error("Component not in viewToVNodeMap");
        }
        return vn;
    }

    protected nodeDoubleClick(e: EntityMouseEvent): void {
        let comp: DecathlonComponent;
        let vnode: IVisualNode;

        comp = (e.target as DecathlonComponent);

        vnode = this.lookupNode(comp);

        let evt: VisualNodeEvent = new VisualNodeEvent(VisualNodeEvent.DOUBLE_CLICK, vnode.node);
        this.entityDispatchEvent(evt);

        this.currentRootVNode = vnode;

        // draw();
    }

    protected nodeMouseClick(e: EntityMouseEvent): void {
        let ecomponent: DecathlonComponent = e.target;

        if (this._nodeMovedInDrag) {
            return;
        }

        let evnode: IVisualNode = this._nodeViewToVNodeMap.get(ecomponent);

        if (evnode != null) {
            if (this.selectedNode != null) {
                if (this.selectedNode.vnode != null)
                   this.selectedNode.vnode.view.isSelected = false;
            }

            this.selectedNode = evnode.node;

            this.selectedNode.vnode.view.isSelected = true;
            // node view z 位置深度
        }

        if (this.selectedEdge != null) {
            let edgeView: BaseEdgeRenderer = this.selectedEdge.vedge.edgeView;
            edgeView.unSelectedEdge();
        }

        this.selectedEdge = null;

        // e.stopImmediatePropagation();
        this.entityDispatchEvent(new VisualNodeEvent(VisualNodeEvent.CLICK, evnode.node));
    }

    protected nodeMouseDown(e: EntityMouseEvent): void {
        if (this.currentSeletedNodeRenderer !== e.target) {
            if (this.currentSeletedNodeRenderer != null &&
                this.currentSeletedNodeRenderer.rendererState === CommConst.NODE_TABLE_STATE) {
                this.currentSeletedNodeRenderer.removeCompass();
            }

            this.currentSeletedNodeRenderer = e.target;

            if (this.currentSeletedNodeRenderer != null &&
                this.currentSeletedNodeRenderer.rendererState === CommConst.NODE_TABLE_STATE &&
                !this.currentSeletedNodeRenderer.isTransformCompassDisplay)
                this.currentSeletedNodeRenderer.createCompass();
        }

        if (this.graphState === LinkSheetConst.GRAPH_STATE) {
            this._nodeMovedInDrag = false;
            this.dragBegin(e);
        }
        // 待续
        // if (relationshipState == RelationshipConst.GRAPH_STATE){
        //     _nodeMovedInDrag = false;
        //     dragBegin(e);
        // }
    }

    public dragBegin(event: EntityMouseEvent): void {

        let ecomponent: DecathlonComponent;
        let evnode: IVisualNode;
        let pt: Point;

        // if (_layouter && _layouter.animInProgress) {
        //     LogUtil.info(_LOG, "Animation in progress, drag attempt ignored");
        //     return;
        // }

        ecomponent = event.target;

        evnode = this._nodeViewToVNodeMap.get(ecomponent);

        // event.stopImmediatePropagation();

        if (evnode != null) {
            pt = new Point(ecomponent.x, ecomponent.y);

            // this._drag_x_offsetMap[ecomponent] = pt.x
            // this._drag_y_offsetMap[ecomponent] = pt.y;

            // this._dragComponent = ecomponent;
            // ecomponent.entityAddEventListener(EntityMouseEvent.MOUSE_MOVE, this.handleDrag, this);
            this.entityAddEventListener(EntityMouseEvent.MOUSE_UP, this.dragEnd, this);

            // ecomponent.stage.addEventListener(MouseEvent.MOUSE_UP, dragEnd);

            // _nodeMouseDownLocation = globalMousePosition();
            this.entityDispatchEvent(new VisualNodeEvent(VisualNodeEvent.DRAG_START, evnode.node));
            // _layouter.dragEvent(event, evnode);
        } else {
            throw Error("Event Component was not in the viewToVNode Map");
        }
    }

    public dragEnd(event: EntityMouseEvent): void {
        if (this.isNodeTransformCompassMouseDown)
            this.isNodeTransformCompassMouseDown = false;

        // const mpoint:Point = globalMousePosition();

        let mycomp: DecathlonComponent;
        let myback: DecathlonComponent;
        let myvnode: IVisualNode;

        this.entityRemoveEventListener(EntityMouseEvent.MOUSE_OUT, this.dragEnd);
        this.entityRemoveEventListener(EntityMouseEvent.MOUSE_UP, this.dragEnd);

        if (this._backgroundDragInProgress) {

            this._backgroundDragInProgress = false;

            // myback.entityRemoveEventListener(EntityMouseEvent.MOUSE_MOVE, this.backgroundDragContinue);

            // if(_layouter) {
            //     _layouter.bgDropEvent(event);
            // }

            // if (event.type == EntityMouseEvent.MOUSE_OUT) {
            //     CursorManager.removeAllCursors();
            // }

            // if (this._mouseDownLocation &&
            //     // Math.abs(mpoint.x - this._mouseDownLocation.x) > 2 ||
            //     // Math.abs(mpoint.y - this._mouseDownLocation.y) > 2) {
            //     this.entityDispatchEvent(new VisualGraphEvent(VisualGraphEvent.BACKGROUND_DRAG_END));
            // } else {
            //     this.entityDispatchEvent(new VisualGraphEvent(VisualGraphEvent.BACKGROUND_CLICK));
            // }
        } else {

            // mycomp = this._dragComponent;

            // if (mycomp == null) {
            //     return;
            // }

            // mycomp.entityRemoveEventListener(EntityMouseEvent.MOUSE_MOVE, this.handleDrag);
            myvnode = this._nodeViewToVNodeMap.get(mycomp);
            // if (_layouter) {
            //     _layouter.dropEvent(event, myvnode);
            // }

            // if(_nodeMouseDownLocation &&
            //     Math.abs(mpoint.x - _nodeMouseDownLocation.x) > 2 ||
            //     Math.abs(mpoint.y - _nodeMouseDownLocation.y) > 2) {
            //     this.entityDispatchEvent(new VisualNodeEvent(VisualNodeEvent.DRAG_END, myvnode.node));
            // }

            // this._dragComponent = null;
        }
    }

    public removeVEdge(ve: IVisualEdge): void {
        if (ve == null) {
            return;
        }

        this.setEdgeVisibility(ve, false);
        this._edgeViewToVEdgeMap.delete(ve.edgeView);
        ve.edge.vedge = null;
        this._vedges.delete(ve);
    }

    protected setEdgeVisibility(ve: IVisualEdge, visible: boolean): void {
        let edgeComp: IEdgeRenderer;

        if (ve.isVisible === visible)
            return;

        if (visible === true) {
            this._visibleVEdges.set(ve, ve);

            if (this._visibleVEdgesList.indexOf(ve) === -1)
                this._visibleVEdgesList.push(ve);

            if (ve.edgeView == null)
                edgeComp = this.createVEdgeView(ve);

            ve.isVisible = true;
        } else {
            ve.isVisible = false;
            this.deleteVisibleVEdge(ve);
        }
    }

    protected deleteVisibleVEdge(ve: IVisualEdge): void {
        ve.isVisible = false;

        let newEdgeList: Array<IVisualEdge> = [];
        for (let e of this._visibleVEdgesList) {
            if (e !== ve)
                newEdgeList.push(e);
        }
        this._visibleVEdgesList = newEdgeList;

        if (ve.edgeView != null) {
            this.removeVEdgeView(ve.edgeView);
        }

        this._visibleVEdges.delete(ve);
    }

    public createVEdge(e: IEdge): IVisualEdge {
        return null;
    }

    protected removeVEdgeView(component: BaseEdgeRenderer): void {

        let ve: IVisualEdge;

        // if (component.parent != null) {
        //     component.parent.removeChild(DisplayObject(component));
        // }

        ve = this._edgeViewToVEdgeMap.get(component);
        ve.edgeView = null;
        this._edgeViewToVEdgeMap.delete(component);
    }

    protected createVEdgeView(ve: IVisualEdge): IEdgeRenderer {

        let mycomponent: BaseEdgeRenderer = null;

        if (this._edgeRendererFactory != null) {
            mycomponent = this.edgeRendererFactory.newInstance();
        } else {
            mycomponent = new BaseEdgeRenderer(null, null);
        }

        mycomponent.percentWidth = 100;
        mycomponent.percentHeight = 100;

        // UIComponent(mycomponent).useHandCursor = true;
        // UIComponent(mycomponent).buttonMode = true;

        // mycomponent.entityAddEventListener(EntityMouseEvent.CLICK, this.edgeClicked, this);
        // mycomponent.entityAddEventListener(EntityMouseEvent.MOUSE_OVER, this.edgeRollOver, this);
        // mycomponent.entityAddEventListener(EntityMouseEvent.MOUSE_OUT, this.edgeRollOut, this);

        mycomponent.data = ve;

        // edgeLayer.addChild(DisplayObject(mycomponent));

        ve.edgeView = mycomponent;
        this._edgeViewToVEdgeMap.set(mycomponent, ve);

        return mycomponent;
    }

    public init() {
        // 模拟数据
        let vStepDatas = [{stepId: 1, stepName: "step1", width: 250, height: 1080, backgroundColor: "#54A0FF"},
                            {stepId: 2, stepName: "step2",  width: 250, height: 1080, backgroundColor: "#0BD3FF"},
                            {stepId: 3, stepName: "step3", width: 250, height: 1080, backgroundColor: "#2ED5D6"},
                            {stepId: 4, stepName: "step4", width: 250, height: 1080, backgroundColor: "#36D1A1"},
                            {stepId: 5, stepName: "step5", width: 250, height: 1080, backgroundColor: "#FBC958"}];
        let vNodeDatas = [{id: "node1", name: "Alice", stepId: 1, nodeType: "BaseSheet",
                            x: 50, y: 100, nodeStatus: "nodeIconState"},
                    {id: "node2", name: "Kevin", stepId: 1, nodeType: "BaseSheet", x: 60, y: 200, nodeStatus: "nodeIconState"},
                    {id: "node3", name: "Jane", stepId: 2, nodeType: "ETLSheet", x: 10, y: 20, nodeStatus: "nodeIconState"},
                    {id: "node4", name: "Daniel", stepId: 2, nodeType: "LinkModule", x: 30, y: 300, nodeStatus: "nodeIconState"},
                    {id: "node4", name: "CiCi", stepId: 3, nodeType: "ETLSheet", x: 100, y: 200, nodeStatus: "nodeIconState"}];
        let vEdgeDatas = [{id: "edge1", sourceId: "node1", targetId: "node2", transfrom: []},
                            {id: "edge2", sourceId: "node2", targetId: "node3", transfrom: []},
                            {id: "edge1", sourceId: "node2", targetId: "node4", transfrom: []}];

        let stepedNodeData: Map<number, Array<object>> = LinkSheetDataUtil.layerNodesDataForStep(vNodeDatas);
        console.log(stepedNodeData.size);
        this.initVGroup();
        this.initGraph({nodes: vNodeDatas, edges: vEdgeDatas});
        // 初始化画布

        this.initStep(vStepDatas);  // 初始化step区域
        // this.initNode(vNodeDatas);  // 初始化节点

        this.owner.entityDispatchEvent(new LinkSheetHeaderEvent(LinkSheetHeaderEvent.GET_HEADER_INIT_DATA, vStepDatas));
    }

    public initGraph(graphData: Object): void {
        this.graph = new LinkSheetGraph("linkSheetGraph", true);
        this.graph.initFromData(graphData);
        this.initFromGraph();
    }

    protected initVGroup(): void {
        this._stepRendererFactory = new ComponentFactory(StepContainer);
        this._nodeRendererFactory = new ComponentFactory(LinkSheetNodeRenderer);
    }

    protected initStep(stepDatas: Array<object>): void {
        let initStepDatas: Array<any> = [];
        // 初始化所有step实例用于后续加载
        for (let stepItemData of stepDatas) {
            let itemView: any = this._stepRendererFactory.newInstance();
            let itemDict: Map<string, any> = new Map<string, any>();
            itemDict.set(CommConst.VIEW, itemView);
            itemDict.set(CommConst.PROPS, stepItemData);
            initStepDatas.push(itemDict);
        }

        this.setState({stepsElement: initStepDatas});
    }

    protected initNode(nodeDatas: Array<object>): void {
        let initNodeDatas: Array<any> = [];
        for (let nodeItemData of nodeDatas) {
            let itemView: any = this._nodeRendererFactory.newInstance();
            let itemDict: Map<string, any> = new Map<string, any>();
            itemDict.set(CommConst.VIEW, itemView);
            itemDict.set(CommConst.PROPS, nodeItemData);
            initNodeDatas.push(itemDict);
        }

        this.setState({nodesElement: initNodeDatas});
    }

    render() {
        return (
            <div id={"linkSheetCanvas"}
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
                    this.state["stepsElement"].map((item, key) => {
                        const StepComponent = (item as Map<string, any>).get(CommConst.VIEW);
                        const stepProps = (item as Map<string, any>).get(CommConst.PROPS);
                        return < StepComponent key={key} {...stepProps}/>;
                    })
                }
                {/*{*/}
                    {/*this._graph.nodes.map((item, key) => {*/}

                    {/*})*/}
                {/*}*/}
                {
                    this.state["nodesElement"].map((item, key) => {
                        const NodeComponent = item.vnode.view;
                        const nodeProps = item.data;
                        return < NodeComponent key={key} {...nodeProps}/>;
                    })
                }
            </div>
        );
    }
}