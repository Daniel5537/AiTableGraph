import {DecathlonComponent} from "../workflow/components/DecathlonComponent";
import {TestEventComponent} from "./TestEventComponent";
import * as React from "react";
import {PersonEvent} from "../events/PersonEvent";
import {DecathlonCanvas} from "../workflow/components/DecathlonCanvas";

export class TestEventParentComponent extends DecathlonComponent {
    private testEntity: DecathlonComponent;
    private canvas: DecathlonCanvas;
    private owner = this;
    private _testLab: string;
    constructor(props, context) {
        super(props, context);
        this.entityAddEventListener(PersonEvent.TEST_EVENT, this.onThisEventHandler, this);
    }

    componentDidMount() {
        this.testEntity.entityAddEventListener(PersonEvent.TEST_EVENT, this.onChildEventHandler, this);
        console.log("listener");
        this.entityAddEventListener(PersonEvent.TEST_EVENT, this.onThisEventHandler, this);
    }

    onThisEventHandler = (event: PersonEvent) => {
        console.log("父类回调！");
        console.log(event.target instanceof TestEventComponent);
        event.target.parentCall();
        this.onThisCallBack();
    }

    public set testLab(value: string) {
        this._testLab = value;
    }

    public get testLab(): string {
        return this._testLab;
    }

    onThisCallBack = () => {
        this.testLab = "哈哈哈哈啊哈哈";
        console.log("lalalla");
        console.log(this.testLab);
    }

    onChildEventHandler = (event: PersonEvent) => {
        console.log(event.data + "测试");
    }

    onBtnClick = (event) => {
        this.canvas.height = 500;
        this.canvas.width = 600;
        this.canvas.x = 600;
        this.canvas.y = 200;
        this.canvas.position = "absolute";
        this.canvas.updateStyle();
    }

    render() {
        return (
            <div>
                <button onClick={this.onBtnClick}>hihihi</button>
                <TestEventComponent owner={this.owner} getEntity={(testEntity) => {this.testEntity = testEntity; }}/>
                <DecathlonCanvas width={200} height={100} owner={this.owner} getEntity={(testEntity) => {this.canvas = testEntity; }}/>
            </div>
        );
    }
}