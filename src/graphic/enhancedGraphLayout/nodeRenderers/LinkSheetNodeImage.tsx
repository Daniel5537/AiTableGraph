import {DecathlonComponent} from "../../../workflow/components/DecathlonComponent";
import * as React from "react";
import {EntityMouseEvent} from "../../../workflow/events/EntityMouseEvent";
import {CommConst} from "../../consts/CommConst";
import {LinkSheetNodeEvent} from "../../../events/LinkSheetNodeEvent";
import {LinkSheetConst} from "../../consts/LinkSheetConst";
import "./LinkSheetNodeImage.scss";

export class LinkSheetNodeImage extends DecathlonComponent {
    protected _nodeType: string;
    protected _nodeStatus: string;
    constructor(props, context) {
        super(props, context);

        if (this.props[CommConst.NODE_STATUS])
            this._nodeStatus = this.props[CommConst.NODE_STATUS];
        if (this.props[LinkSheetConst.NODE_TYPE])
            this._nodeType = this.props[LinkSheetConst.NODE_TYPE];
    }

    public get nodeType(): string {
        return this._nodeType;
    }

    render() {
        let imgSrcUrl = null;
        switch (this._nodeType) {
            case LinkSheetConst.LINK_SHEET_BASE_TYPE:
                imgSrcUrl = "assets/icons/Table.png";
                break;
            case LinkSheetConst.LINK_SHEET_ETL_TYPE:
                imgSrcUrl = "assets/icons/ETL.png";
                break;
            case LinkSheetConst.LINK_SHEET_MODULE_TYPE:
                imgSrcUrl = "assets/icons/LinkModule.png";
                break;
        }
        return (
            <div className="nodeImageDiv">
                <img src={imgSrcUrl} className="nodeImageIcon"/>
            </div>
        );
    }
}