import * as React from "react";
import * as ReactDOM from "react-dom";
import {TestEventGrandFatherComponent} from "./components/TestEventGrandFatherComponent";
// import {TestRender} from "./components/TestRender";
import "./scss/main.scss";
import "./global.scss";
import {DecathlonLinkSheetVisualGraph} from "./graphic/enhancedGraphLayout/DecathlonLinkSheetVisualGraph";
import {AiTableLinkSheet} from "./applications/AiTableLinkSheet";

ReactDOM.render(
    <AiTableLinkSheet/>,
    document.getElementById("root")
);