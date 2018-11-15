import {IEventDispatcher} from "../../../workflow/events/IEventDispatcher";
import {IVisualGraph} from "./IVisualGraph";

export interface IVisualItem extends IEventDispatcher {
    id: number;
    data: object;
    vgraph: IVisualGraph;
    isVisible: boolean;
    centered: boolean;
}