import {DecathlonComponent} from "../workflow/components/DecathlonComponent";
import * as React from "react";
import {DecathlonLinkSheetVisualGraph} from "../graphic/enhancedGraphLayout/DecathlonLinkSheetVisualGraph";
import {AiTableLinkSheetStepHeader} from "../components/AiTableLinkSheetStepHeader";
import {EventBus} from "../workflow/global/EventBus";
import {LinkSheetHeaderEvent} from "../events/LinkSheetHeaderEvent";
import {LinkSheetDataUtil} from "../graphic/utils/LinkSheetDataUtil";
import {CommConst} from "../graphic/consts/CommConst";
import {EntityMouseEvent} from "../workflow/events/EntityMouseEvent";
import {Point} from "../base/Point";
import {StepHeaderContainer} from "../components/StepHeaderContainer";
import {StepContainer} from "../graphic/enhancedGraphLayout/StepContainer";
import {LinkSheetStepContainerEvent} from "../events/LinkSheetStepContainerEvent";
import "./AiTableLinkSheet.scss";

export class AiTableLinkSheet extends DecathlonComponent {
    protected _linkSheetHeader: AiTableLinkSheetStepHeader;
    protected _mouseStatus: string;
    protected _selectedStepResizeContainer: StepHeaderContainer;
    protected _mapChangeSizeStepContainer: StepContainer;
    protected _dalutX: number = 0;
    protected _dalutY: number = 0;

    constructor(props, context) {
        super(props, context);
    }

    componentWillMount() {
        // 初始化Header Container宽度监听
        this.entityAddEventListener(LinkSheetHeaderEvent.GET_HEADER_INIT_DATA, this.onGetHeaderInitDataHandler, this);
        // 监听初始化鼠标坐标
        this.entityAddEventListener(EntityMouseEvent.MOUSE_DOWN, this.onMouseDownHandler, this);
        // 监听操作哪个Header Container，拿回引用
        EventBus.getInstance().addEventListener(LinkSheetHeaderEvent.HEADER_SIZE_CHANGE_BTN_DOWN, this.onHeaderSzieChangeBtnDownHandler, this);
        EventBus.getInstance().addEventListener(LinkSheetStepContainerEvent.MAP_HEADER_STEP_CONTAINER, this.onMapHeaderStepContainer, this);
    }

    onHeaderSzieChangeBtnDownHandler = (event: LinkSheetHeaderEvent) => {
        this._selectedStepResizeContainer = event.data;
        this._mouseStatus = CommConst.STEP_HEADER_RESZIE_MOUSE_STATUS;
    }

    onMapHeaderStepContainer = (event: LinkSheetStepContainerEvent) => {

        this._mapChangeSizeStepContainer = event.data;
        this.entityAddEventListener(EntityMouseEvent.MOUSE_MOVE, this.onMouseMoveHandler, this);
    }

    // 初始化鼠标坐标
    onMouseDownHandler = (event) => {
        this._dalutX = event.data["nativeEvent"]["clientX"];
        this._dalutY = event.data["nativeEvent"]["clientY"];
    }

    // 监听鼠标移动，按状态判断作后续操作
    onMouseMoveHandler = (event: EntityMouseEvent) => {
        this.entityAddEventListener(EntityMouseEvent.MOUSE_UP, this.onMouseUpHandler, this);

        switch (this._mouseStatus) {
            // Header改变宽度状态
            case CommConst.STEP_HEADER_RESZIE_MOUSE_STATUS:
                let offsetPoint: Point = new Point(event.data["nativeEvent"]["clientX"], event.data["nativeEvent"]["clientY"]);
                this.changeStepSize(offsetPoint);
                break;
        }
    }

    // 改变step区域宽度
    changeStepSize(op: Point): void {
        let offsetX: number = op.x - this._dalutX;
        console.log(this._selectedStepResizeContainer.width);
        let newWidth: number = this._selectedStepResizeContainer.width + offsetX;
        if (newWidth >= CommConst.STEP_MIN_WIDTH){
            this._selectedStepResizeContainer.width = newWidth;
            this._mapChangeSizeStepContainer.width = newWidth;
            this._selectedStepResizeContainer.updateStyle();
            this._mapChangeSizeStepContainer.updateStyle();
        }
        this._dalutX = op.x;
    }

    // 监听鼠标放开
    onMouseUpHandler = (event: EntityMouseEvent) => {
        this._mouseStatus = CommConst.DEFAULT_MOUSE_STATUS;
        this._selectedStepResizeContainer = null;
        this.entityRemoveEventListener(EntityMouseEvent.MOUSE_UP, this.onMouseUpHandler);
        this.entityRemoveEventListener(EntityMouseEvent.MOUSE_MOVE, this.onMouseUpHandler);
    }

    // 初始化Header
    onGetHeaderInitDataHandler = (event: LinkSheetHeaderEvent) => {
        console.log(event.data);
        this._linkSheetHeader.data = LinkSheetDataUtil.getStepHeaderInitDatas(event.data as Array<any>);
        this._linkSheetHeader.updateHeader();
    }

    render() {
        return (
            <div className={"aiTableLinkSheet"}
                 onMouseDown={this.entityMouseEventDispatch}
                 onMouseMove={this.entityMouseEventDispatch}
                 onMouseUp={this.entityMouseEventDispatch}>
                <AiTableLinkSheetStepHeader owner={this} getEntity={(header) => {this._linkSheetHeader = header; } }/>
                <DecathlonLinkSheetVisualGraph id={"vgraph"} percentWidth={100}
                                               percentHeight={100} owner={this}/>
            </div>
        );
    }
}