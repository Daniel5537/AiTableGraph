import {Graph} from "../../graphic/graphLayout/data/Graph";
import {INode} from "../../graphic/graphLayout/data/INode";
import {IEdge} from "../../graphic/graphLayout/data/IEdge";

export class RelationGraph extends Graph {
    public data: object;
    constructor(id: string, directional: boolean = false, xmlsource: XMLDocument = null) {
        super(id, directional, xmlsource);
    }

    public linkNodeByEdgeVO(edgeVo: object): IEdge{
        if(edgeVo == null)
            return null;

        let fromNode: INode;
        let toNode: INode;

        fromNode = this.nodeByStringId(edgeVo["sourceId"]);
        toNode = this.nodeByStringId(edgeVo["targetId"]);

        if (fromNode != null && toNode != null){
            let edge: IEdge = this.link(fromNode, toNode, edgeVo);
            return edge;
        }

        return null;
    }

    public initFromVO(vo: object): void {
        this.data = vo;
        if (vo == null)
            return;

        let nodeProp: string = Graph.DEFAULTNAME_NODE;
        let edgeProp: string = Graph.DEFAULTNAME_EDGE;
        let fromIDProp: string = Graph.DEFAULTNAME_FROMID;
        let toIDProp: string = Graph.DEFAULTNAME_TOID;

        let fromNodeId: string;
        let toNodeId: string;
        let nodeId: string;

        let fromNode: INode;
        let toNode: INode;

        let elements: object = vo[Graph.DEFAULTNAME_NODE];
        let arrElements: Array<any>;
        if (!elements)
            arrElements = [];
        else if (elements instanceof Array) {
            arrElements = elements as Array<any>;
        } else {
            arrElements = [elements];
        }

        let edges: object = vo[Graph.DEFAULTNAME_EDGE];
        let arrEdges: Array<any>;
        if (!edges)
            arrEdges = [];
        else if (edges instanceof Array)
        arrEdges = edges as Array<any>;
    else
        arrEdges = [edges];

        this._edges = arrEdges;

        for (let nodeVO of arrElements) {
            nodeId = nodeVO.id;
            fromNode = this.createNode(nodeId, nodeVO);
        }

        for (let edgeVO of arrEdges) {
            fromNodeId = edgeVO[fromIDProp];
            toNodeId = edgeVO[toIDProp];

            fromNode = this.nodeByStringId(fromNodeId);
            toNode = this.nodeByStringId(toNodeId);

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
}