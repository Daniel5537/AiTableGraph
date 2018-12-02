import * as React from "react";
import {VisualGraph} from "../graphic/graphLayout/visual/VisualGraph";
import {DecathlonComponent} from "../workflow/components/DecathlonComponent";
import "../scss/main.scss";
import {IGraph} from "../graphic/graphLayout/data/IGraph";
import {Graph} from "../graphic/graphLayout/data/Graph";
import {RelationGraph} from "../business/graph/RelationGraph";

export class TestRender extends DecathlonComponent {
    protected vgraph: VisualGraph;
    protected graph: IGraph;

    constructor(props, context) {
        super(props, context);
        this.state = {
            nodes: [{"id": "node1", "name": "Alice"},
                {"id": "node2", "name": "Kevin"},
                {"id": "node3", "name": "Jane"},
                {"id": "node4", "name": "Daniel"}],
            edges: [{"id": "edge1", "sourceId": "node1", "targetId": "node2"},
                {"id": "edge2", "sourceId": "node2", "targetId": "node3"},
                {"id": "edge1", "sourceId": "node2", "targetId": "node4"}]
        };
    }

    init = (graphData: object) => {
        this.graph = new RelationGraph("RelationGraph", true);
        (this.graph as RelationGraph).initFromVO(graphData);
        this.vgraph.graph = this.graph;
    }

    componentDidMount() {
        let obj: object = {
            nodes: [{"id": "node1", "name": "Alice"},
                {"id": "node2", "name": "Kevin"},
                {"id": "node3", "name": "Jane"},
                {"id": "node4", "name": "Daniel"}],
            edges: [{"id": "edge1", "sourceId": "node1", "targetId": "node2"},
                {"id": "edge2", "sourceId": "node2", "targetId": "node3"},
                {"id": "edge1", "sourceId": "node2", "targetId": "node4"}]
        };
        this.init(obj);
    }

    render() {
        return(
            <VisualGraph percentWidth={100}
                         percentHeight={100}
                         getEntity={(vgEntity) => {this.vgraph = vgEntity}}/>
        );
    }
}