import {DecathlonComponent} from "../workflow/components/DecathlonComponent";
import * as React from "react";
import {StepHeaderContainer} from "./StepHeaderContainer";
import {EventBus} from "../workflow/global/EventBus";
import {LinkSheetHeaderEvent} from "../events/LinkSheetHeaderEvent";

export class AiTableLinkSheetStepHeader extends DecathlonComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            stepHeaderContainer: []
        };
    }

    public updateHeader(): void {
        this.setState({stepHeaderContainer: this._data});
    }

    render() {
        return (
            <div className={"setpHeader"}>
                {
                    this.state["stepHeaderContainer"].map((item, key) => {
                        return <StepHeaderContainer key={key} {...item}/>;
                    })
                }
            </div>
        );
    }
}












