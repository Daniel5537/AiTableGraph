import * as React from "react";
import {VisualGraph} from "../graphic/graphLayout/visual/VisualGraph";
import {DecathlonComponent} from "../workflow/components/DecathlonComponent";

export class TestRender extends DecathlonComponent {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {

    }

    render(){
        return(
            <VisualGraph/>
        );
    }
}