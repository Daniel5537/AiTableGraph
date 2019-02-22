import {EventDispatcher} from "../workflow/events/EventDispatcher";
import {IResponder} from "../workflow/events/interfaces/IResponder";
import {HttpService} from "../workflow/request/HttpService";
import {LinkSheetServiceEvent} from "../events/LinkSheetServiceEvent";
import {RequestConst} from "../graphic/consts/RequestConst";

export class GetBaseSheetTreeCommand extends EventDispatcher implements IResponder {
    private _condition: any;
    constructor(params: object, condition: any = null) {
        super();
        this._condition = condition;
        let httpService: HttpService = new HttpService(RequestConst.GET_BASE_SHEET_TREE_URL, this);
        httpService.sendPostRequest(params);
    }

    result(data: object): void {
        // todo
        let resultData: object = data;
        this.dispatchEvent(new LinkSheetServiceEvent(LinkSheetServiceEvent.GET_BASE_SHEET_TREE_RESULT, resultData));
    }

    fault(info: object): void {
        // todo
    }
}