import {DecathlonComponent} from "../../../workflow/components/DecathlonComponent";
import * as React from "react";
import {LinkSheetConst} from "../../consts/LinkSheetConst";

export class LinkSheetNodeList extends DecathlonComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            titleLabel: this.props["name"]
        };
    }

    render() {
        return (
            <div className="nodeListDiv">
                <div>
                    <div>{this.state[LinkSheetConst.TITLE_LABEL_TEXT]}</div>
                </div>
            </div>
        );
    }
}