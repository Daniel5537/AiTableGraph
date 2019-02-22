import {INode} from "./INode";
import {Node} from "./Node";
import {IEdge} from "./IEdge";
import {Edge} from "./Edge";
import {IGTree} from "./IGTree";
import {GTree} from "./GTree";
import {Graph} from "./Graph";
import {IGraph} from "./IGraph";
import {EventDispatcher} from "../../../workflow/events/EventDispatcher";

export class LinkSheetGraph extends EventDispatcher implements IGraph {
    protected _nodes: Array<INode>;
    protected _edges: Array<IEdge>;
    protected _currentNodeId: number;
    protected _numberOfNodes: number;
    protected _nodesByStringId: Map<string, INode>;
    protected _nodesById: Map<number, INode>;
    protected _treeMap: Map<INode, IGTree>;
    protected _numberOfEdges: number;
    protected _currentEdgeId: number;
    public id: string;
    public isDirectional: boolean = true;
    protected _nodeSortFunction: (a: INode, b: INode) => number = null;

    constructor(id: string, directional: boolean = false, source: object = null) {
        super();
        this._nodes = [];
        this._edges = [];
        this._nodesByStringId = new Map<string, INode>();
        this._nodesById = new Map<number, INode>();
        this._numberOfEdges = 0;
        this._currentEdgeId = 0;
        this._treeMap = new Map<INode, IGTree>();

        if (source != null) {
            this.initFromData(source);
        }
    }

    public initFromData(data: object): void {
        if (data == null)
            return;

        let fromIDProp: string = Graph.DEFAULTNAME_FROMID;
        let toIDProp: string = Graph.DEFAULTNAME_TOID;

        let fromNodeId: string;
        let toNodeId: string;
        let nodeId: string;

        let fromNode: INode;
        let toNode: INode;

        let nodeElements: Array<object> = data["nodes"];
        let edgeElements: Array<object> = data["edges"];

        for (let nodeVO of nodeElements) {
            nodeId = nodeVO["id"];
            fromNode = this.createNode(nodeId, nodeVO);
        }

        for (let edgeVO of edgeElements) {
            fromNodeId = edgeVO[fromIDProp];
            toNodeId = edgeVO[toIDProp];

            fromNode = this._nodesByStringId[fromNodeId];
            toNode = this._nodesByStringId[toNodeId];

            if (fromNode == null) {
                console.log("Node id: " + fromNodeId + " not found, link not done");
                continue;
            }

            if (toNode == null) {
                console.log("Node id: " + toNodeId + " not found, link not done");
                continue;
            }

            this.link(fromNode, toNode, edgeVO);
        }
    }

    public createNode(sid: string = "", o: object = null): INode {
        let myid: number = ++this._currentNodeId;
        let mysid: string = sid;
        let myNode: Node;
        let myaltid: number = myid;

        if (mysid === "") {
            mysid = myid.toString();
        }

        while (this._nodesByStringId.hasOwnProperty(mysid)) {
            console.log("sid: " + mysid + " already in use, trying alternative");
            mysid = (++myaltid).toString();
        }

        myNode = new Node(myid, mysid, null, o);

        this._nodes.unshift(myNode);
        this._nodesByStringId[mysid] = myNode;
        this._nodesById[myid] = myNode;
        ++this._numberOfNodes;

        return myNode;
    }

    public link(node1: INode, node2: INode, o: object = null): IEdge {

        let retEdge: IEdge;

        if (node1 == null) {
            console.log("node: " + node1.id + "was null");
            throw Error("link: node1 was null");
        }
        if (node2 == null) {
            console.log("node: " + node2.id + "was null");
            throw Error("link: node2 was null");
        }

        if (node1.successors.indexOf(node2) !== -1) {
            console.log("Link between nodes:" + node1.id + " and " +
                node2.id + " already exists, returning existing edge");

            let outedges: Array<Edge> = node1.outEdges;

            for (let edge of outedges) {
                if (edge.othernode(node1) === node2) {
                    retEdge = edge;
                    break;
                }
            }
            if (retEdge == null) {
                throw Error("We did not find the edge although it should be there");
            }
        } else {
            let newEid: number = ++this._currentEdgeId;

            let newEdge: Edge = new Edge(this, null, newEid, node1, node2, o);
            this._edges.unshift(newEdge);
            ++this._numberOfEdges;

            node1.addOutEdge(newEdge);
            node2.addInEdge(newEdge);

            // LogUtil.debug(_LOG, "Graph is directional? "+_directional.toString());

            node1.addInEdge(newEdge);
            node2.addOutEdge(newEdge);

            retEdge = newEdge;
        }

        return retEdge;
    }

    public unlink(node1: INode, node2: INode): void {

        let e: IEdge;

        e = this.getEdge(node1, node2);

        if (e == null) {
            throw Error("Could not find edge, Nodes: " + node1.id + " and "
                + node2.id + " may not be linked.");
        } else {
            this.removeEdge(e);
        }
    }

    public getEdge(n1: INode, n2: INode): IEdge {
        let outedges: Array<any> = n1.outEdges;
        let e: IEdge = null;
        for (let edge of outedges) {
            if (edge.othernode(n1) === n2) {
                e = edge;
                return e;
            }
        }
        return null;
    }

    public removeEdge(e: IEdge): void {
        let n1: INode = e.node1;
        let n2: INode = e.node2;
        let edgeIndex: number = this._edges.indexOf(e);

        if (edgeIndex === -1) {
            throw Error("Edge: " + e.id + " does not seem to exist in graph " + this.id);
        }

        n1.removeOutEdge(e);
        n2.removeInEdge(e);

        n1.removeInEdge(e);
        n2.removeOutEdge(e);

        this._edges.splice(edgeIndex, 1);
        --this._numberOfEdges;

        this.purgeTrees();
    }

    public nodeByStringId(sid: string, caseSensitive: boolean= true): INode {
        if (caseSensitive) {
            if (this._nodesByStringId.get(sid)) {
                return this._nodesByStringId.get(sid);
            } else {
                return null;
            }
        } else {
            for (let ident of this._nodesByStringId.keys()) {
                if (ident.toLowerCase() === sid.toLowerCase()) {
                    return this._nodesByStringId.get(ident);
                }
            }

            return null;
        }
    }

    public nodeById(id: number): INode {
        if (this._nodesById.hasOwnProperty(id)) {
            return this._nodesById[id];
        } else {
            return null;
        }
    }

    public removeNode(n: INode): void {
        if (n.inEdges.length !== 0 || n.outEdges.length !== 0) {
            throw Error("Attempted to remove Node: " + n.id + " but it still has Edges");
        } else {
            let myindex: number = this._nodes.indexOf(n);

            if (myindex === -1) {
                throw Error("Node: " + n.id + " was not found in the graph's" +
                    "node table while trying to delete it");
            }

            this._nodes.splice(myindex, 1);
            --this._numberOfNodes;

            this._nodesByStringId.delete(n.stringid);
            this._nodesById.delete(n.id);

            if (n.vnode != null) {
                throw Error("Node is still associated with its vnode, this leaves a dangling reference and a potential memory leak");
            }
        }
    }

    public getTree(n: INode, restr: boolean = false, nocache: boolean = false, direction: number = 2): IGTree {
        if (nocache) {
            return new GTree(n, this, restr, direction);
        }

        if (!this._treeMap.get(n)) {
            this._treeMap.set(n, new GTree(n, this, restr, direction));

            this._treeMap.get(n).initTree();
        }
        return this._treeMap.get(n);
    }

    public purgeTrees(): void {
        this._treeMap = new Map<INode, IGTree>();
    }

    public purgeGraph(): void {

        while (this._edges.length > 0) {
            this.removeEdge(this._edges[0]);
        }

        while (this._nodes.length > 0) {
            this.removeNode(this._nodes[0]);
        }
        this.purgeTrees();
    }

    public set nodes(value: Array<INode>) {
        this._nodes = value;
    }

    public get nodes(): Array<INode> {
        return this._nodes;
    }

    public set edges(value: Array<IEdge>) {
        this._edges = value;
    }

    public get edges(): Array<IEdge> {
        return this._edges;
    }

    public get noNodes(): number {
        return this._numberOfNodes;
    }

    public get noEdges(): number {
        return this._numberOfEdges;
    }

    public set nodeSortFunction(f: (a: INode, b: INode) => number) {
        this._nodeSortFunction = f;
    }

    public get nodeSortFunction(): (a: INode, b: INode) => number {
        return this._nodeSortFunction;
    }
}
