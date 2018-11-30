import * as React from "react";
import {VisualGraph} from "../graphic/graphLayout/visual/VisualGraph";
import {DecathlonComponent} from "../workflow/components/DecathlonComponent";
import "../scss/main.scss";

export class TestRender extends DecathlonComponent {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {

    }

    render(){
        return(
            <VisualGraph className="VGroup"/>
        );
    }
}