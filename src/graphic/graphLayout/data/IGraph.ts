import {INode} from "./INode";
import {IEdge} from "./IEdge";
import {IGTree} from "./IGTree";
import {IEventDispatcher} from "../../../workflow/events/IEventDispatcher";

export interface IGraph extends IEventDispatcher {
    id: string;
    nodes: Array<INode>;
    edges: Array<IEdge>;
    noNodes: number;
    noEdges: number;
    isDirectional: boolean;
    nodeSortFunction: (a: INode, b: INode) => number;

    nodeByStringId(sid: string, caseSensitive: boolean): INode;

    nodeById(id: number): INode;

    createNode(sid: string, o: object): INode;

    removeNode(n: INode): void;

    getTree(n: INode, restr: boolean, nocache: boolean): IGTree;

    purgeTrees(): void;

    link(node1: INode, node2: INode, o: object): IEdge;

    unlink(node1: INode, node2: INode): void;

    getEdge(n1: INode, n2: INode): IEdge;

    removeEdge(e: IEdge): void;

    purgeGraph(): void;
}