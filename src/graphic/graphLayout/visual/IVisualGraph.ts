import {IEventDispatcher} from "../../../workflow/events/IEventDispatcher";
import {IFactory} from "../../../workflow/global/IFactory";
import {Point} from "../../../base/Point";
import {IVisualNode} from "./IVisualNode";
import {IVisualEdge} from "./IVisualEdge";
import {IGraph} from "../data/IGraph";
import {ILayoutAlgorithm} from "../layout/ILayoutAlgorithm";
import {EntityMouseEvent} from "../../../workflow/events/EntityMouseEvent";
import {IComponentFactory} from "../../../workflow/global/IComponentFactory";
import {IEdgeRenderer} from "./IEdgeRenderer";
import {IDecathlonEventDispatcher} from "../../../workflow/components/DecathlonComponent";

export interface IVisualGraph extends IDecathlonEventDispatcher {
    graph: IGraph;
    itemRenderer: IComponentFactory;
    edgeRenderer: IEdgeRenderer;
    edgeLabelRenderer: IComponentFactory;
    displayEdgeLabels: boolean;
    layouter: ILayoutAlgorithm;
    origin: Point;
    center: Point;
    visibleVNodes: Map<IVisualNode, IVisualNode>;
    noVisibleVNodes: number;
    visibleVEdges: Map<IVisualEdge, IVisualEdge>;
    showHistory: boolean;
    currentRootVNode: IVisualNode;
    visibilityLimitActive: boolean;
    maxVisibleDistance: number;
    scale: number;

    initFromGraph(): void;

    clearHistory(): void;

    createNode(sid: string, o: object): IVisualNode;

    removeNode(vn: IVisualNode): void;

    linkNodes(v1: IVisualNode, v2: IVisualNode): IVisualEdge;

    unlinkNodes(v1: IVisualNode, v2: IVisualNode): void;

    refresh(): void;

    draw(flags: number): void;

    redrawEdges(): void;

    // redrawNodes(): void;
    refreshVnode(vn: IVisualNode): void;

    closeSubVnode(vn: IVisualNode): void;

    refresh(): void;

    scroll(sx: number, sy: number, reset: boolean): void;
    // reloadData(xml:XML): void;
    // removeAllChildren(): void;

    handleDrag2(event: EntityMouseEvent): void;
    dragEnd(event: EntityMouseEvent): void;
    dragBegin(event: EntityMouseEvent): void;
    setNodeVisibility(vn: IVisualNode, visible: boolean): void;

    updateConnectedEdgesVisibility(vn: IVisualNode): void;
    calcNodesBoundingBox(): any;    //Rectangle
}