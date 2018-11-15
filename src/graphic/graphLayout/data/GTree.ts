import {EventDispatcher} from "../../../workflow/events/EventDispatcher";
import {IGTree} from "./IGTree";
import {IGraph} from "./IGraph";
import {INode} from "./INode";
import {Node} from "./Node";

export class GTree extends EventDispatcher implements IGTree {
    // private static _LOG: string = "graphLayout.data.GTree";

    public static WALK_FORWARDS: number = 0;
    public static WALK_BACKWARDS: number = -1;
    public static WALK_BOTH: number = 2;

    protected _walkingDirection: number = GTree.WALK_BOTH;
    protected _graph: IGraph;
    protected _root: INode;
    protected _maxDepth: number;
    protected _parentMap: Map<INode, INode>;
    protected _childrenMap: Map<INode, Array<any>>;
    protected _distanceMap: Map<INode, number>;
    protected _amountNodesWithDistance: Array<any>;
    protected _maxNumberPerLayer: number;
    protected _nodeChildIndexMap: Map<INode, number>;
    protected _nodeNoChildrenMap: Map<INode, number>;
    protected _restrictToVisible: boolean;
    protected _nodesWithoutLinkToNextLevel: Map<INode, INode>;

    constructor(root: INode, graph: IGraph, restrict: boolean= false, direction: number= GTree.WALK_BOTH) {
        super();

        this._parentMap = null;
        this._childrenMap = null;
        this._distanceMap = null;
        this._nodeChildIndexMap = null;
        this._nodeNoChildrenMap = null;
        this._amountNodesWithDistance = null;
        this._walkingDirection = direction;
        this._maxNumberPerLayer = 0;
        this._root = root;
        this._graph = graph;
        this._maxDepth = 0;
        this._restrictToVisible = restrict;
    }

    public get restricted(): boolean {
        return this._restrictToVisible;
    }

    public get parents(): Map<INode, INode> {
        if (this._parentMap == null) {
            this.initTree();
        }
        return this._parentMap;
    }

    public get distances(): Map<INode, number> {
        if (this._distanceMap == null) {
            this.initTree();
        }
        return this._distanceMap;
    }

    public get maxDepth(): number {
        return this._maxDepth;
    }

    public get root(): INode {
        return this._root;
    }

    public set root(r: INode) {
        this._root = r;
        this.initMaps();
    }

    public get maxNumberPerLayer(): number {
        return this._maxNumberPerLayer;
    }

    public set walkingDirection(d: number) {
        this._walkingDirection = d;
    }

    public get walkingDirection(): number {
        return this._walkingDirection;
    }

    public get XMLtree(): XMLDocument {
        return null;
        // let resXML: XMLDocument;
        // let nxml: XMLDocument;
        // let pxml: XMLDocument;
        // let children: Array<any>;
        // let queue: Array<any>;
        // let nodeToXML: object;
        // let i: number;
        // let n: INode;
        // let p: INode;
        //
        // if (this._childrenMap == null) {
        //     initTree();
        // }
        //
        // queue = [];
        // nodeToXML = {};
        //
        // resXML = new XMLDocument(this._root.data);
        // pxml = resXML;
        // nodeToXML[_root] = pxml;
        // queue.unshift(_root);
        //
        // while(queue.length > 0) {
        //     p = queue.pop();
        //     pxml = nodeToXML[p];
        //     children = (_childrenMap[p] as Array);
        //     for(i=0;i<children.length;++i) {
        //         n = (children[i] as INode);
        //         nodeToXML[n] = new XML(n.data);
        //         pxml.appendChild(nodeToXML[n]);
        //         if(_nodeNoChildrenMap[n] > 0) {
        //             queue.unshift(n);
        //         }
        //     }
        // }
        // return resXML;
    }

    public getDistance(n: INode): number {
        if (this._distanceMap == null) {
            this.initTree();
        }
        return this._distanceMap.get(n);
    }

    public getChildIndex(n: INode): number {
        if (this._nodeChildIndexMap == null) {
            this.initTree();
        }
        return this._nodeChildIndexMap.get(n);
    }

    public getNoChildren(n: INode): number {
        if (this._nodeNoChildrenMap == null) {
            this.initTree();
        }
        return this._nodeNoChildrenMap.get(n);
    }

    public getChildren(n: INode): Array<any> {
        if (this._childrenMap == null) {
            this.initTree();
        }
        return (this._childrenMap.get(n));
    }

    public getNodesWithoutLinkToNextLevel(): Array<INode> {
        let retVal: Array<INode> = [];
        for (let node of this._nodesWithoutLinkToNextLevel.values()) {
            retVal.push(node);
        }
        return retVal;
    }

    public getNoSiblings(n: INode): number {
        let p: INode;

        if (this._parentMap == null) {
            this.initTree();
        }

        p = this.parents[n.id];
        if (p == null) {
            return 1;
        } else {
            return this.getNoChildren(p);
        }
    }

    public areSiblings(n: INode, m: INode): boolean {
        return (this.parents[n.id] === this.parents[m.id]);
    }

    public getIthChildPerNode(n: INode, i: number): INode {
        if (this._childrenMap == null) {
            this.initTree();
        }
        if (this._childrenMap.get(n) == null) {
            throw Error("no childmap for node n:" + n.id);
        }
        return this._childrenMap.get(n)[i];
    }

    public initTree(): Map<INode, INode> {

        let queue: Array<any> = [];

        let dummyParent: INode = new Node(0, "dummyNode", null, null);

        let u: INode;
        // let v: INode;
        // let i: number;
        // let j: number;
        let childcount: number;

        this.initMaps();

        this.setValues(this._root, dummyParent, 0.5, 0);

        queue.push(this._root);

        while (queue.length > 0) {

            u = (queue.shift() as INode);

            if (this._restrictToVisible && !u.vnode.isVisible) {
                continue;
            }

            childcount = 0;
            let nodesToWalk: Array<INode> = null;
            switch (this.walkingDirection) {
                case GTree.WALK_FORWARDS:
                    nodesToWalk = u.successors;
                    break;
                case GTree.WALK_BACKWARDS:
                    nodesToWalk = u.predecessors;
                    break;
                case GTree.WALK_BOTH:
                    nodesToWalk = u.successors.concat(u.predecessors);
                    break;
                default:
                    throw Error("unknown graph walking direction");
            }

            for (let adjacentNode of nodesToWalk) {
                let v: INode = adjacentNode;

                if (this._restrictToVisible && !v.vnode.isVisible) {
                    continue;
                }

                if (this._parentMap.get(v) == null) {

                    this.setValues(v, u, this._distanceMap.get(u) + 1, childcount);

                    queue.push(v);

                    ++childcount;
                }
            }

            this._nodeNoChildrenMap.set(u, childcount);
        }

        for (let node of this._graph.nodes) {
            let linksToNextLevel: boolean = false;

            let level: number = this._distanceMap.get(node);
            for (let n2 of node.successors) {
                if (level < this._distanceMap.get(n2)) {
                    linksToNextLevel = true;
                    break;
                }
            }

            if (linksToNextLevel) {
                continue;
            }

            for (let n3 of node.predecessors) {
                if (level < this._distanceMap.get(n3)) {
                    linksToNextLevel = true;
                    break;
                }
            }

            if (!linksToNextLevel) {
                this._nodesWithoutLinkToNextLevel.set(node, node);
            }
        }

        this._parentMap.set(this._root, null);

        this.nodeSortChildren();

        return this._parentMap;
    }

    public getLimitedNodes(limit: number): Map<INode, INode> {
        let result: Map<INode, INode> = new Map<INode, INode>();
        let key: INode;

        if (this._distanceMap == null) {
            this.initTree();
        }

        for (key of this._distanceMap.keys()) {
            if (this._distanceMap.get(key) <= limit) {
                result.set(key, key);
            }
        }
        return result;
    }

    public getNumberNodesWithDistance(d: number): number {
        if (this._amountNodesWithDistance == null) {
            this.initTree();
        }
        if (this._amountNodesWithDistance[d] == null) {
            return 0;
        } else {
            return this._amountNodesWithDistance[d];
        }
    }

    protected initMaps(): void {
        this._parentMap = new Map<INode, INode>();
        this._childrenMap = new Map<INode, Array<any>>();
        this._distanceMap = new Map<INode, number>();
        this._nodesWithoutLinkToNextLevel = new Map<INode, INode>();

        this._amountNodesWithDistance = [];

        this._nodeChildIndexMap = new Map<INode, number>();
        this._nodeNoChildrenMap = new Map<INode, number>();

        this._maxNumberPerLayer = 0;

        this._maxDepth = 0;

        for (let i: number = 0; i < this._graph.noNodes; ++i) {
            this._parentMap.set(this._graph.nodes[i], null);
        }
    }

    protected nodeSortChildren(): void {
        let children: Array<INode>;
        let childIndex: number;

        if (this._graph.nodeSortFunction != null) {
            for (children of this._childrenMap.values()) {
                children.sort(this._graph.nodeSortFunction);

                for (childIndex = 0; childIndex < children.length; ++childIndex) {
                    this._nodeChildIndexMap.set(children[childIndex], childIndex);
                }
            }
        }
    }

    protected setValues(n: INode, p: INode, d: number, cindex: number): void {

        // let childarray: Array<any>;

        this._parentMap.set(n, p);
        this._distanceMap.set(n, d);

        if (this._amountNodesWithDistance[d] == null) {
            this._amountNodesWithDistance[d] = 0;
        }
        ++this._amountNodesWithDistance[d];

        this._maxNumberPerLayer = Math.max(this._maxNumberPerLayer, this._amountNodesWithDistance[d]);

        this._nodeChildIndexMap.set(n, cindex);

        this._maxDepth = Math.max(this._maxDepth, d);

        if (this._childrenMap.get(p) == null) {
            this._childrenMap.set(p, []);
        }

        this._childrenMap.get(p)[cindex] = n;
    }
}