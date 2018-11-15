import {IVisualNode} from "../visual/IVisualNode";
import {IEdge} from "./IEdge";
import {IDataItem} from "./IDataItem";

export interface INode extends IDataItem {
    stringid: string;
    inEdges: Array<any>;
    outEdges: Array<any>;
    predecessors: Array<any>;
    successors: Array<any>;
    vnode: IVisualNode;
    fieldsNodeArray: Array<any>;

    addInEdge(e: IEdge): void;

    addOutEdge(e: IEdge): void;

    removeInEdge(e: IEdge): void;

    removeOutEdge(e: IEdge): void;

    edgeVisible: boolean;
}