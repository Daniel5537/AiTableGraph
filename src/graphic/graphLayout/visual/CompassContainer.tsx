import {DecathlonCanvas} from "../../../workflow/components/DecathlonCanvas";
import {DecathlonComponent, IDecathlonComponentProps} from "../../../workflow/components/DecathlonComponent";
import "./CompassContainer.scss";
import * as React from "react";


export class CompassContainer extends DecathlonComponent {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className={"compassContainer"}>

            </div>
        );
    }
}