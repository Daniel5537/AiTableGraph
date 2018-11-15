import {IEventDispatcher} from "../../../workflow/events/IEventDispatcher";

export interface IDataItem extends IEventDispatcher {
    id: number;
    data: object;
}