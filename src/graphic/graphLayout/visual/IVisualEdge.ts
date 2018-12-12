import {IEdge} from "../data/IEdge";
import {DecathlonComponent} from "../../../workflow/components/DecathlonComponent";
import {Point} from "../../../base/Point";
import {IVisualItem} from "./IVisualItem";
import {IEdgeRenderer} from "./IEdgeRenderer";
import {BaseEdgeRenderer} from "./edgeRenderers/BaseEdgeRenderer";

export interface IVisualEdge extends IVisualItem {
    edge: IEdge;
    labelView: DecathlonComponent;

    setEdgeLabelCoordinates(p: Point): void;

    lineStyle: object;
    edgeView: BaseEdgeRenderer;
}