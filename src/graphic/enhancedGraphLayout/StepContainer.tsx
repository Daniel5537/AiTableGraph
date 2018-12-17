import {DecathlonCanvas} from "../../workflow/components/DecathlonCanvas";
import {DecathlonComponent, IDecathlonComponentProps} from "../../workflow/components/DecathlonComponent";
import * as React from "react";
import "./StepContainer.scss";
import {CommConst} from "../consts/CommConst";
import {EventBus} from "../../workflow/global/EventBus";
import {LinkSheetHeaderEvent} from "../../events/LinkSheetHeaderEvent";
import {StepHeaderContainer} from "../../components/StepHeaderContainer";
import {LinkSheetStepContainerEvent} from "../../events/LinkSheetStepContainerEvent";

export class StepContainer extends DecathlonComponent {
    protected _stepId: number;
    protected _nodeDatas: Array<object>;
    constructor(props, context) {
        super(props, context);

        if (this.props[CommConst.STEP_ID])
            this._stepId = this.props[CommConst.STEP_ID];

        this.state = {
            stepName: this.props[CommConst.STEP_NAME],
            styleObject: {},
            nodesElement: [],
            nodesContainer: []
        };
    }

    public set nodeDatas(value: Array<object>) {
        if (this._nodeDatas === value)
            return;

        this._nodeDatas = value;
    }

    componentDidMount() {
        console.log("step init" + " = " + this._stepId);
        // 监听Header mouse down
        EventBus.getInstance().addEventListener(LinkSheetHeaderEvent.HEADER_SIZE_CHANGE_BTN_DOWN, this.onHeaderSizeChangeBtnDownHandler, this);
    }

    // 返回本地组件引用给顶层
    onHeaderSizeChangeBtnDownHandler = (event: LinkSheetHeaderEvent) => {
        let tmpHeaderComponent: StepHeaderContainer = event.data;
        let tmpStepId: number = tmpHeaderComponent.stepId;
        if (this._stepId === tmpStepId)
            EventBus.getInstance().dispatchEvent(new LinkSheetStepContainerEvent(LinkSheetStepContainerEvent.MAP_HEADER_STEP_CONTAINER, this));
    }

    public set stepId(value: number) {
        this._stepId = value;
    }

    public get stepId(): number {
        return this._stepId;
    }

    render() {
        return (
            <div className={"stepContainer"}
                 style={this.state[CommConst.STYLE_OBJECT]}
                 onClick={this.entityMouseEventDispatch}
                 onMouseDown={this.entityMouseEventDispatch}
                 onMouseMove={this.entityMouseEventDispatch}
                 onMouseUp={this.entityMouseEventDispatch}
                 onMouseOver={this.entityMouseEventDispatch}
                 onMouseOut={this.entityMouseEventDispatch}
                 onMouseEnter={this.entityMouseEventDispatch}
                 onMouseLeave={this.entityMouseEventDispatch}
                 onDoubleClick={this.entityMouseEventDispatch}>
                {
                    this.state["nodesContainer"].map((item, key) => {
                        const ChildrenComponent = (item as Map<string, any>).get("view");
                        const stepProps = (item as Map<string, any>).get("props");
                        return < ChildrenComponent key={key} {...stepProps}/>;
                    })
                }
            </div>
        );
    }
}