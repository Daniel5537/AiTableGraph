import {EventDispatcher} from "../../../workflow/events/EventDispatcher";
import {INode} from "./INode";
import {IDataRenderer} from "../../../base/IDataRenderer";
import {IVisualNode} from "../visual/IVisualNode";
import {IEdge} from "./IEdge";

export class Node extends EventDispatcher implements INode, IDataRenderer {
    protected _dataObject: object;
    protected _nodeData: object;
    protected _id: number;
    protected _vnode: IVisualNode;
    protected _inEdges: Array<any>;
    protected _outEdges: Array<any>;
    protected _predecessors: Array<any>;
    protected _successors: Array<any>;
    protected _edgeVisible: boolean;
    protected _stringid: string;
    protected _fieldsNodeArray: Array<any>;

    constructor(id: number, sid: string, vn: IVisualNode, o: object) {
        super();
        this._inEdges = [];
        this._outEdges = [];
        this._predecessors = [];
        this._successors = [];
        this._id = id;
        this._stringid = sid;
        this._dataObject = o;
        this._vnode = vn;

        if (o != null && o.hasOwnProperty("edgeVisible") && typeof o["edgeVisible"] === "boolean") {
            this._edgeVisible = o["edgeVisible"];
        }
    }

    public get nodeData(): object {
        return this._nodeData;
    }

    public set nodeData(value: object) {
        this._nodeData = value;
    }

    public addInEdge(e: IEdge): void {
        // @ts-ignore
        if (e.othernode(this) == null) {
            throw Error("Edge:" + e.id + " has no fromNode");
        }

        // @ts-ignore
        this._predecessors.unshift(e.othernode(this));
        this._inEdges.unshift(e);
    }

    public addOutEdge(e: IEdge): void {
        // @ts-ignore
        if (e.othernode(this) == null) {
            throw Error("Edge:" + e.id + " has no toNode");
        }

        // @ts-ignore
        this._successors.unshift(e.othernode(this));
        this._outEdges.unshift(this);
    }

    public removeInEdge(e: IEdge): void {
        // @ts-ignore
        let otherNode: INode = e.othernode(this);
        let theEdgeIndex: number = this._inEdges.indexOf(e);
        let theNodeIndex: number = this._predecessors.indexOf(otherNode);

        if (theEdgeIndex === -1) {
            throw Error("Could not find edge: " + e.id + " in InEdge list of node: " + this._id);
        } else {
            this._inEdges.splice(theEdgeIndex, 1);
        }

        if (otherNode == null) {
            throw Error("Edge:" + e.id + " has no node 1");
        }

        if (theNodeIndex === -1) {
            throw Error("Could not find node: " + otherNode.id + " in predecessor list of node: " + this._id);
        } else {
            this._predecessors.splice(theEdgeIndex, 1);
        }
    }

    public removeOutEdge(e: IEdge): void {
        // @ts-ignore
        let otherNode: INode = e.othernode(this);
        let theEdgeIndex: number = this._outEdges.indexOf(e);
        let theNodeIndex: number = this._successors.indexOf(otherNode);

        if (theEdgeIndex === -1) {
            throw Error("Could not find edge: " + e.id + " in OutEdge list of node: " + this._id);
        } else {
            this._outEdges.splice(theEdgeIndex, 1);
        }

        if (otherNode == null) {
            throw Error("Edge: " + e.id + " has no node 2");
        }

        if (theNodeIndex === -1) {
            throw Error("Could not find node: " + otherNode.id + " in predecessor list of node: " + this._id);
        } else {
            this._successors.splice(theEdgeIndex, 1);
        }
    }

    public get successors(): Array<any> {
        return this._successors;
    }

    public get outEdges(): Array<any> {
        return this._outEdges;
    }

    public get inEdges(): Array<any> {
        return this._inEdges;
    }

    public get predecessors(): Array<any> {
        return this._predecessors;
    }

    public set data(o: object)  {
        this._dataObject = o;
    }

    public get data(): object	{
        return this._dataObject;
    }

    public get vnode(): IVisualNode {
        return this._vnode;
    }

    public set vnode(v: IVisualNode) {
        this._vnode = v;
    }

    public get id(): number {
        return this._id;
    }

    public get stringid(): string {
        return this._stringid;
    }

    public set edgeVisible(value: boolean) {
        this._edgeVisible = value;
    }

    public get edgeVisible(): boolean {
        return this._edgeVisible;
    }

    public set fieldsNodeArray(value: Array<any>) {
        this._fieldsNodeArray = value;
    }

    public get fieldsNodeArray(): Array<any> {
        return this._fieldsNodeArray;
    }
}