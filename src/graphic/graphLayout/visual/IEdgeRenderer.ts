import {IDataRenderer} from "../../../base/IDataRenderer";
import {IEventDispatcher} from "../../../workflow/events/IEventDispatcher";

export interface IEdgeRenderer extends IDataRenderer {
    draw(): void;
}