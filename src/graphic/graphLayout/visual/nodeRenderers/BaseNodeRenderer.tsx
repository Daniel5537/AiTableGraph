import {DecathlonComponent} from "../../../../workflow/components/DecathlonComponent";
import {INodeRenderer} from "../../../enhancedGraphLayout/INodeRenderer";
import {Point} from "../../../../base/Point";

export class BaseNodeRenderer extends DecathlonComponent implements INodeRenderer {
    constructor(props, context) {
        super(props, context);
    }

    labelCoordinates(label: DecathlonComponent): Point {
        return new Point(label.x, label.y);
    }
}