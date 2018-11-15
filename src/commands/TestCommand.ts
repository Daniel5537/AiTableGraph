import {EventDispatcher} from "../workflow/events/EventDispatcher";
import {IResponder} from "../workflow/events/interfaces/IResponder";
import {HttpService} from "../workflow/request/HttpService";
import {TestHttpDataEvent} from "../events/TestHttpDataEvent";

export class TestCommand extends EventDispatcher implements IResponder {
    private _condition: any;
    constructor(url: string, params: object, condition: any = null) {
        super();
        this._condition = condition;
        let httpService: HttpService = new HttpService(url, this);
        httpService.sendPostRequest(params);
    }

    result(data: object): void {
        // todo
        let resultData: object = data;
        this.dispatchEvent(new TestHttpDataEvent(TestHttpDataEvent.SUCCESS_GET_DATA, resultData));
    }

    fault(info: object): void {
        // todo
    }
}