import {EventDispatcher} from "../../../workflow/events/EventDispatcher";
import {IEdge} from "./IEdge";
import {IDataRenderer} from "../../../base/IDataRenderer";
import {IGraph} from "./IGraph";
import {INode} from "./INode";
import {IVisualEdge} from "../visual/IVisualEdge";

export class Edge extends EventDispatcher implements IEdge, IDataRenderer {
    protected _graph: IGraph;
    protected _id: number;
    protected _node1: INode;
    protected _node2: INode;
    protected _dataObject: object;
    protected _vedge: IVisualEdge;
    protected _directional: boolean;

    constructor(graph: IGraph, ve: IVisualEdge, id: number, node1: INode, node2: INode, data: object) {
        super();
        this._graph = graph;
        this._vedge = ve;
        this._id = id;
        this._node1 = node1;
        this._node2 = node2;
        this._dataObject = data;
    }

    public get id(): number {
        return this._id;
    }

    public get toNode(): INode {
        if (this._directional) {
            return this._node2;
        } else {
            throw Error("Graph: " + this._graph.id + " is not directional");
        }
    }

    public get fromNode(): INode {
        if (this._directional) {
            return this._node1;
        } else {
            throw Error("Graph: " + this._graph.id + " is not directional");
        }
    }

    public get node1(): INode {
        return this._node1;
    }

    public get node2(): INode {
        return this._node2;
    }

    public othernode(node: INode): INode {
        if (node === this._node1) {
            return this.node2;
        } else if (node === this._node2) {
            return this._node1;
        } else {
            return null;
        }
    }

    public set data(o: object) {
        this._dataObject = o;
    }

    public get data(): object	{
        return this._dataObject;
    }

    public get vedge(): IVisualEdge {
        return this._vedge;
    }

    public set vedge(ve: IVisualEdge) {
        this._vedge = ve;
    }

    public get isDirectional(): boolean {
        return this._directional;
    }
}