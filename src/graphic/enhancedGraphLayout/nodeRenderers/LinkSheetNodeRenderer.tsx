import {DecathlonComponent} from "../../../workflow/components/DecathlonComponent";
import {LinkSheetConst} from "../../consts/LinkSheetConst";
import {IVisualNode} from "../../graphLayout/visual/IVisualNode";

export class LinkSheetNodeRenderer extends DecathlonComponent {
    protected _vnode: IVisualNode;
    protected _rendererState: string;
    public isTransformCompassDisplay: boolean;
    constructor(props, context) {
        super(props, context);
        this.state = {
            rendererState: LinkSheetConst.LINK_SHEET_ICON_STATE,
        };
    }

    public set rendererState(value: string) {
        if (this._rendererState === value)
            return;

        this._rendererState = value;
        this.setState({rendererState: this._rendererState});
    }

    public get rendererState(): string {
        return this._rendererState;
    }

    public set vnode(value: IVisualNode) {
        this._vnode = value;
    }

    public get vnode(): IVisualNode {
        return this._vnode;
    }

    public createCompass(): void {

    }

    public removeCompass(): void {

    }

    render() {
        let nodeView = null;
        switch (this.state["nodeState"]) {
            case LinkSheetConst.LINK_SHEET_ICON_STATE:
                break;
            case LinkSheetConst.LINK_SHEET_LIST_STATE:
                break;
        }

        return (
            {

            }
        );
    }
}