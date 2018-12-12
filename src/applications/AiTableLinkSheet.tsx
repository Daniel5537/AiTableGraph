import {DecathlonComponent} from "../workflow/components/DecathlonComponent";
import * as React from "react";
import {DecathlonLinkSheetVisualGraph} from "../graphic/enhancedGraphLayout/DecathlonLinkSheetVisualGraph";

export class AiTableLinkSheet extends DecathlonComponent{
    constructor(props, context){
        super(props, context);
    }

    render() {
        return (
            <DecathlonLinkSheetVisualGraph id={"vgraph"} percentWidth={100}
                                           percentHeight={100}/>

        );
    }
}