import {IEventDispatcher} from "../../../workflow/events/IEventDispatcher";
import {IFactory} from "../../../workflow/global/IFactory";
import {Point} from "../../../base/Point";
import {IVisualNode} from "./IVisualNode";
import {IVisualEdge} from "./IVisualEdge";
import {IGraph} from "../data/IGraph";
import {ILayoutAlgorithm} from "../layout/ILayoutAlgorithm";

export interface IVisualGraph extends IEventDispatcher {
    graph: IGraph;
    itemRenderer: IFactory;
    edgeRendererFactory: IFactory;
    edgeLabelRenderer: IFactory;
    displayEdgeLabels: boolean;
    layouter: ILayoutAlgorithm;
    origin: Point;
    center: Point;
    visibleVNodes: Array<any>;
    noVisibleVNodes: number;
    visibleVEdges: Array<any>;
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

    redrawNodes(): void;

    scroll(sx: number, sy: number, reset: boolean): void;

    calcNodesBoundingBox(): any;    //Rectangle
}