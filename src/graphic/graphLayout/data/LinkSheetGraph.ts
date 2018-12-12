import {INode} from "./INode";
import {IEdge} from "./IEdge";
import {IGTree} from "./IGTree";
import {Graph} from "./Graph";

export class LinkSheetGraph extends Graph {
    // protected _currentNodeId: number;
    // protected _numberOfNodes: number;
    // protected _nodesByStringId: object;
    // protected _nodesById: object;
    protected _nodes: Array<INode>;
    protected _edges: Array<IEdge>;
    protected _treeMap: Map<INode, IGTree>;

    constructor(id: string, directional: boolean = false, source: object = null) {
        super(id, directional);
        this._nodes = [];
        this._edges = [];
        // this._nodesByStringId = {};
        // this._nodesById = {};
        this._treeMap = new Map<INode, IGTree>();

        if (source != null){
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

    // public createNode(sid: string = "", o: object = null): INode {
    //     let myid: number = ++this._currentNodeId;
    //     let mysid: string = sid;
    //     let myNode: Node;
    //     let myaltid: number = myid;
    //
    //     if (mysid === "") {
    //         mysid = myid.toString();
    //     }
    //
    //     while (this._nodesByStringId.hasOwnProperty(mysid)) {
    //         console.log("sid: " + mysid + " already in use, trying alternative");
    //         mysid = (++myaltid).toString();
    //     }
    //
    //     myNode = new Node(myid, mysid, null, o);
    //
    //     this._nodes.unshift(myNode);
    //     this._nodesByStringId[mysid] = myNode;
    //     this._nodesById[myid] = myNode;
    //     ++this._numberOfNodes;
    //
    //     this.purgeTrees();
    //
    //     return myNode;
    // }
    //
    // public link(node1: INode, node2: INode, o: object = null): IEdge {
    //
    //     let retEdge: IEdge;
    //
    //     if (node1 == null) {
    //         console.log("node: " + node1.id + "was null");
    //         throw Error("link: node1 was null");
    //     }
    //     if (node2 == null) {
    //         console.log("node: " + node2.id + "was null");
    //         throw Error("link: node2 was null");
    //     }
    //
    //     if (node1.successors.indexOf(node2) !== -1) {
    //         console.log("Link between nodes:" + node1.id + " and " +
    //             node2.id + " already exists, returning existing edge");
    //
    //         let outedges: Array<Edge> = node1.outEdges;
    //
    //         for (let edge in outedges) {
    //             if (edge.othernode(node1) === node2) {
    //                 retEdge = edge;
    //                 break;
    //             }
    //         }
    //         if(retEdge == null) {
    //             throw Error("We did not find the edge although it should be there");
    //         }
    //     } else {
    //         var newEid:int = ++_currentEdgeId;
    //
    //         var newEdge:Edge = new Edge(this,null,newEid,node1,node2,o);
    //         _edges.unshift(newEdge);
    //         ++_numberOfEdges;
    //
    //         node1.addOutEdge(newEdge);
    //         node2.addInEdge(newEdge);
    //
    //         //LogUtil.debug(_LOG, "Graph is directional? "+_directional.toString());
    //         if(!_directional) {
    //             node1.addInEdge(newEdge);
    //             node2.addOutEdge(newEdge);
    //             //LogUtil.debug(_LOG, "graph is not directional adding same edge:"+newEdge.id+
    //             //" the other way round");
    //         }
    //         retEdge = newEdge;
    //     }
    //
    //     purgeTrees()
    //     return retEdge;
    // }
    //
    // public purgeTrees(): void {
    //     this._treeMap = new Map<INode, IGTree>();
    // }
}
