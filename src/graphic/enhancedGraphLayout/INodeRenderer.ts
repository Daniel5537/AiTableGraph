import {DecathlonComponent} from "../../workflow/components/DecathlonComponent";
import {Point} from "../../base/Point";

export interface INodeRenderer {
    labelCoordinates(label: DecathlonComponent): Point;
}