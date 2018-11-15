import {INode} from "./INode";
import {IVisualEdge} from "../visual/IVisualEdge";
import {IDataItem} from "./IDataItem";

export interface IEdge extends IDataItem {
    isDirectional: boolean;
    node1: INode;
    node2: INode;
    fromNode: INode;
    toNode: INode;
    vedge: IVisualEdge;

    othernode(node: INode): INode;
}