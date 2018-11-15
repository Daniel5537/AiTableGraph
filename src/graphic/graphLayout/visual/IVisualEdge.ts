import {IEdge} from "../data/IEdge";
import {DecathlonComponent} from "../../../workflow/components/DecathlonComponent";
import {Point} from "../../../base/Point";
import {IVisualItem} from "./IVisualItem";
import {IEdgeRenderer} from "./IEdgeRenderer";

export interface IVisualEdge extends IVisualItem {
    edge: IEdge;
    labelView: DecathlonComponent;

    setEdgeLabelCoordinates(p: Point): void;

    lineStyle: object;
    edgeView: IEdgeRenderer;
}