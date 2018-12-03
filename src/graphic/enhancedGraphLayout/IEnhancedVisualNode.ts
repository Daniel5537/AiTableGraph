import {IVisualNode} from "../graphLayout/visual/IVisualNode";
import {DecathlonComponent} from "../../workflow/components/DecathlonComponent";
import {Point} from "../../base/Point";

export interface IEnhancedVisualNode extends IVisualNode{
    labelView: DecathlonComponent;
    setNodeLabelCoordinates(): void;
    outEdgeDot: Point;
    inEdgeDot: Point;
}