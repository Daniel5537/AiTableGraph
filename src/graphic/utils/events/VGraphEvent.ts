import {EventBase} from "../../../workflow/events/EventBase";

export class VGraphEvent extends EventBase {
    public static VGRAPH_CHANGED: string = "vgraphChanged";
    public static LAYOUTER_CHANGED: string = "layouterChanged";
    public static LAYOUTER_HIER_SIBLINGSPREAD: string = "hierLayouterSiblingSpreadChanged";
    public static VNODE_UPDATED: string = "vnodeUpdated";
    public static VISIBILITY_CHANGED: string = "visibilityChanged";
    public static VEST_DEFAULT: number = 0;
    public static VEST_LAYOUTER: number = 1;
    private _subtype: number;

    constructor(type: string, bubbles: boolean = false, cancelable: boolean = false, subtype: number = VGraphEvent.VEST_DEFAULT) {
        super(type, bubbles, cancelable);
        this._subtype = subtype;
    }

    public get subtype(): number {
        return this._subtype;
    }
}