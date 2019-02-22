import {DecathlonComponent} from "../workflow/components/DecathlonComponent";
import * as React from "react";
import {Tree} from "antd";
import {LinkSheetConst} from "../graphic/consts/LinkSheetConst";
import {GetBaseSheetTreeCommand} from "../commands/GetBaseSheetTreeCommand";
import {LinkSheetServiceEvent} from "../events/LinkSheetServiceEvent";
import "./AiTableLinkSheetNodeTree.scss";

export class AiTableLinkSheetNodeTree extends DecathlonComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            treeDatas: []
        };
    }

    componentWillMount() {
        // 判断请求基表树 or 链表树
        if (this.props["treeType"] === LinkSheetConst.TYPE_BASE_SHEET) {
            let getBaseSheetTreeCommand: GetBaseSheetTreeCommand = new GetBaseSheetTreeCommand({});
            getBaseSheetTreeCommand.addEventListener(LinkSheetServiceEvent.GET_BASE_SHEET_TREE_RESULT, this.onGetTreeDatasHandler, this, true);
        } else {

        }
    }

    protected onGetTreeDatasHandler(event: LinkSheetServiceEvent): void {
        switch (event.type) {
            case LinkSheetServiceEvent.GET_BASE_SHEET_TREE_RESULT:
                console.log(event);
                break;
            case LinkSheetServiceEvent.GET_LINK_SHEET_TREE_RESULT:
                break;
        }
        console.log(event);
    }

    render() {
        return (
            <div className={"treeDiv"}>
                <Tree>
                    {this.state["treeDatas"]}
                </Tree>
            </div>
        );
    }
}