import {IDataRenderer} from "../../../base/IDataRenderer";
import {IEventDispatcher} from "../../../workflow/events/IEventDispatcher";
import {Point} from "../../../base/Point";
import {IVisualEdge} from "./IVisualEdge";

export interface IEdgeRenderer extends IDataRenderer {
    fPoint: Point;
    tPoint: Point;
    draw(): void;
    labelCoordinates(vedge: IVisualEdge): Point;
}