import {IEventDispatcher} from "../../../workflow/events/IEventDispatcher";
import {INode} from "./INode";

export interface IGTree extends IEventDispatcher {
    restricted: boolean;
    parents: Map<INode, INode>;
    distances: Map<INode, number>;
    root: INode;
    maxDepth: number;
    XMLtree: XMLDocument;
    maxNumberPerLayer: number;
    walkingDirection: number;

    getDistance(n: INode): number;

    getChildIndex(n: INode): number;

    getNoChildren(n: INode): number;

    getNoSiblings(n: INode): number;

    areSiblings(n: INode, m: INode): boolean;

    getChildren(n: INode): Array<any>;

    getIthChildPerNode(n: INode, i: number): INode;

    initTree(): Map<INode, INode>;

    getLimitedNodes(limit: number): Map<INode, INode>;

    getNumberNodesWithDistance(d: number): number;

    getNodesWithoutLinkToNextLevel(): Array<INode>;
}