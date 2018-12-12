import {EventDispatcher} from "../../../workflow/events/EventDispatcher";
import {IGraph} from "./IGraph";
import {INode} from "./INode";
import {IGTree} from "./IGTree";
import {GTree} from "./GTree";
import {Node} from "./Node";
import {IEdge} from "./IEdge";
import {Edge} from "./Edge";

export class Graph extends EventDispatcher implements IGraph {
    public static DEFAULTNAME_NODE: string = "Node";

    public static DEFAULTNAME_EDGE: string = "Edge";

    public static DEFAULTNAME_FIELDSNODE: string = "fieldsNode";

    public static DEFAULTNAME_FROMID: string = "fromID";

    public static DEFAULTNAME_TOID: string = "toID";

    private static _LOG: string = "graphLayout.data.Graph";

    protected _id: string;

    protected _xmlData: XMLDocument;

    protected _nodes: Array<any>;
    protected _edges: Array<any>;

    protected _nodesByStringId: Map<string, INode>;
    protected _nodesById: Map<number, INode>;

    protected _directional: boolean;

    protected _currentNodeId: number;
    protected _currentEdgeId: number;

    protected _numberOfNodes: number;
    protected _numberOfEdges: number;

    protected _treeMap: Map<INode, IGTree>;

    protected _nodeSortFunction: (a: INode, b: INode) => number = null;

    constructor(id: string, directional: boolean = false, xmlsource: XMLDocument = null) {
        super();
        if (id == null)
            throw Error("id string must not be null");
        if (id.length === 0)
            throw Error("id string must not be empty");

        this._id = id;

        this._xmlData = xmlsource;

        this._nodes = [];
        this._edges = [];
        this._treeMap = new Map<INode, IGTree>();

        this._nodesByStringId = new Map<string, INode>();
        this._nodesById = new Map<number, INode>();

        this._directional = directional;
        this._currentNodeId = 0;
        this._currentEdgeId = 0;
        this._numberOfNodes = 0;
        this._numberOfEdges = 0;

        if (xmlsource != null) {
            // initFromXML(xmlsource);
        }
    }

    public static createGraph(id: string, directional: boolean, xmlsource: XMLDocument): IGraph {
        if (xmlsource == null) {
            throw Error("the xmlsource must not be null if creating a new Graph");
        }

        return new Graph(id, directional, xmlsource);
    }

    public get id(): string {
        return this._id;
    }

    public get xmlData(): XMLDocument {
        return this._xmlData;
    }

    public get nodes(): Array<INode> {
        return this._nodes;
    }

    public get edges(): Array<IEdge> {
        return this._edges;
    }

    public get isDirectional(): boolean {
        return this._directional;
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

    public nodeByStringId(sid: string, caseSensitive: boolean = true): INode {
        if (caseSensitive) {
            if (this._nodesByStringId.has(sid)) {
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
        if (this._nodesById.has(id)) {
            return this._nodesById.get(id);
        } else {
            return null;
        }
    }

    public getTree(n: INode, restr: boolean = false, nocache: boolean = false, direction: number = 2): IGTree {
        if (nocache) {
            return new GTree(n, this, restr, direction);
        }

        if (!this._treeMap.has(n)) {
            this._treeMap.set(n, new GTree(n, this, restr, direction));

            this._treeMap.get(n).initTree();
        }
        return this._treeMap.get(n);
    }

    public purgeTrees(): void {
        this._treeMap = new Map<INode, IGTree>();
    }

    public initFromXML(xml: XMLDocument): void {

        // var nodeName:String = DEFAULTNAME_NODE;
        // var edgeName:String = DEFAULTNAME_EDGE;
        // var fromIDName:String = DEFAULTNAME_FROMID;
        // var toIDName:String = DEFAULTNAME_TOID;
        //
        // var xnode:XML;
        // var xedge:XML;
        //
        // var fromNodeId:String;
        // var toNodeId:String;
        //
        // var fromNode:INode;
        // var toNode:INode;
        //
        // //LogUtil.debug(_LOG, "initFromXML called");
        //
        // for each(xnode in xml.descendants(nodeName)) {
        //     fromNode = createNode(xnode.@id, xnode);
        //     //LogUtil.debug(_LOG, "Node:"+fromNode.stringid+" created, total:"+_nodes.length);
        // }
        //
        // for each(xedge in xml.descendants(edgeName)) {
        //     fromNodeId = xedge.attribute(fromIDName);
        //     toNodeId = xedge.attribute(toIDName);
        //
        //     fromNode = nodeByStringId(fromNodeId);
        //     toNode = nodeByStringId(toNodeId);
        //
        //     if(fromNode == null) {
        //         LogUtil.warn(_LOG, "Node id: "+fromNodeId+" not found, link not done");
        //         continue;
        //     }
        //     if(toNode == null) {
        //         LogUtil.warn(_LOG, "Node id: "+toNodeId+" not found, link not done");
        //         continue;
        //     }
        //     link(fromNode,toNode,xedge);
        //     //LogUtil.warn(_LOG, "Current nr of edges:"+_edges.length);
        // }
    }

    public createNode(sid: string = "", o: object = null): INode {

        let myid: number = ++this._currentNodeId;
        let mysid: string = sid;
        let myNode: Node;
        let myaltid: number = myid;

        if (mysid === "") {
            mysid = myid.toString();
        }

        while (this._nodesByStringId.has(mysid)) {
            console.log(Graph._LOG + "sid: " + mysid + " already in use, trying alternative");
            mysid = (++myaltid).toString();
        }

        myNode = new Node(myid, mysid, null, o);

        this._nodes.unshift(myNode);
        this._nodesByStringId.set(mysid, myNode);
        this._nodesById.set(myid, myNode);
        ++this._numberOfNodes;

        this.purgeTrees();

        return myNode;
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

            this.purgeTrees();
        }
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
            console.log(Graph._LOG + "Link between nodes:" + node1.id + " and " +
                node2.id + " already exists, returning existing edge");

            let outedges: Array<IEdge> = node1.outEdges;
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

            if (!this._directional) {
                node1.addInEdge(newEdge);
                node2.addOutEdge(newEdge);
            }
            retEdge = newEdge;
        }

        this.purgeTrees();
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
        let outedges: Array<Edge> = n1.outEdges;
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
            throw Error("Edge: " + e.id + " does not seem to exist in graph " + this._id);
        }

        n1.removeOutEdge(e);
        n2.removeInEdge(e);

        if (!this._directional) {
            n1.removeInEdge(e);
            n2.removeOutEdge(e);
        }

        this._edges.splice(edgeIndex, 1);
        --this._numberOfEdges;

        this.purgeTrees();
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
}