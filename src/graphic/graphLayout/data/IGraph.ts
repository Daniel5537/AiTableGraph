import {INode} from "./INode";
import {IEdge} from "./IEdge";
import {IGTree} from "./IGTree";
import {IEventDispatcher} from "../../../workflow/events/IEventDispatcher";

export interface IGraph extends IEventDispatcher {
    id: string;
    xmlData: XMLDocument;
    nodes: Array<any>;
    edges: Array<any>;
    noNodes: number;
    noEdges: number;
    isDirectional: boolean;
    nodeSortFunction: (a: INode, b: INode) => number;

    nodeByStringId(sid: string, caseSensitive: boolean): INode;

    nodeById(id: number): INode;

    initFromXML(xml: XMLDocument): void;

    createNode(sid: string, o: object): INode;

    removeNode(n: INode): void;

    getTree(n: INode, restr: boolean, nocache: boolean, direction: number): IGTree;

    purgeTrees(): void;

    link(node1: INode, node2: INode, o: object): IEdge;

    unlink(node1: INode, node2: INode): void;

    getEdge(n1: INode, n2: INode): IEdge;

    removeEdge(e: IEdge): void;

    purgeGraph(): void;
}