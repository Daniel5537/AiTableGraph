import {EventBase} from "../workflow/events/EventBase";

export class LinkSheetServiceEvent extends EventBase {
    public static readonly GET_BASE_SHEET_TREE: string = "getBaseSheetTree";
    public static readonly GET_BASE_SHEET_TREE_RESULT: string = "getBaseSheetTreeResult";

    public static readonly GET_LINK_SHEET_TREE: string = "getLinkSheetTree";
    public static readonly GET_LINK_SHEET_TREE_RESULT: string = "getLinkSheetTreeResult";

    constructor(type: string, data: any = null, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
        this.data = data;
    }

    public clone(): EventBase {
        let event: LinkSheetServiceEvent = new LinkSheetServiceEvent(this.type, this.data, this.bubbles, this.cancelable);
        return event;
    }
}