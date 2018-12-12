import * as React from "react";
import * as ReactDOM from "react-dom";
import {TestEventGrandFatherComponent} from "./components/TestEventGrandFatherComponent";
// import {TestRender} from "./components/TestRender";
import "./scss/main.scss";
import {DecathlonLinkSheetVisualGraph} from "./graphic/enhancedGraphLayout/DecathlonLinkSheetVisualGraph";

ReactDOM.render(
    <DecathlonLinkSheetVisualGraph/>,
    document.getElementById("root")
);