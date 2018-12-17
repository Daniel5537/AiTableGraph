import {DecathlonComponent} from "../workflow/components/DecathlonComponent";
import React = require("react");
import "./AiTableLinkSheetStepHeader.scss";
import {CommConst} from "../graphic/consts/CommConst";
import {EventBus} from "../workflow/global/EventBus";
import {LinkSheetHeaderEvent} from "../events/LinkSheetHeaderEvent";
import "./StepHeaderContainer.scss";
import {number} from "prop-types";

export class StepHeaderContainer extends DecathlonComponent {
    private _stepId: number;
    constructor(props, context) {
        super(props, context);

        if (this.props[CommConst.STEP_ID])
            this._stepId = this.props[CommConst.STEP_ID];

        this.state = {
            stepObject: this.props[CommConst.STYLE_OBJECT],
            stepName: this.props[CommConst.STEP_NAME],
            sizeBtnVisual: false
        };
    }

    public get stepId(): number {
        return this._stepId;
    }

    onSizeChangeBtnMouseOverHandler = (event) => {
        this.setState({sizeBtnVisual: true});
    }

    onSizeChangeBtnMouseOutHandler = (evnet) => {
        this.setState({sizeBtnVisual: false});
    }

    onSizeChangeBtnMouseDownHandler = (evnet) => {
        // let stepSizeDict: Map<string, any> = new Map<string, any>();
        // stepSizeDict.set(CommConst.STEP_ID, this._stepId);
        EventBus.getInstance().dispatchEvent(new LinkSheetHeaderEvent(LinkSheetHeaderEvent.HEADER_SIZE_CHANGE_BTN_DOWN, this));
    }

    render() {
        let sizeBtnStyleObj: object = {};
        if (this.state["sizeBtnVisual"])
            sizeBtnStyleObj["backgroundColor"] = "cornflowerblue";
        else
            sizeBtnStyleObj["backgroundColor"] = "#F1F1F1";

        return (
            <div style={this.state[CommConst.STYLE_OBJECT]} className={"stepHeaderContainer"}>
                <p className={"position-center"}>{this.state[CommConst.STEP_NAME]}</p>
                <div className={"changeSzieBtn"} style={sizeBtnStyleObj}
                     onMouseOver={this.onSizeChangeBtnMouseOverHandler}
                     onMouseOut={this.onSizeChangeBtnMouseOutHandler}
                     onMouseDown={this.onSizeChangeBtnMouseDownHandler}/>
            </div>
        );
    }
}