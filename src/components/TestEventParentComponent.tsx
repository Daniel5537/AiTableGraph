import {DecathlonComponent} from "../workflow/components/DecathlonComponent";
import TestEventComponent from "./TestEventComponent";
import * as React from "react";
import {PersonEvent} from "../events/PersonEvent";
import {DecathlonCanvas} from "../workflow/components/DecathlonCanvas";
import {IFactory} from "../workflow/global/IFactory";
import {ClassFactory} from "../workflow/global/ClassFactory";
import {IComponentFactory} from "../workflow/global/IComponentFactory";
import {ComponentFactory} from "../workflow/global/ComponentFactory";

export class TestEventParentComponent extends DecathlonComponent {
    private testEntity: DecathlonComponent;
    private canvas: DecathlonCanvas;
    private testcom: TestEventComponent;
    private owner = this;
    private _testLab: string;
    constructor(props, context) {
        super(props, context);
        this.entityAddEventListener(PersonEvent.TEST_EVENT, this.onThisEventHandler, this);
        this.state = {
            children: []
        };
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
        let t1: IComponentFactory = new ComponentFactory(TestEventComponent);
        // let t2: IComponentFactory = new ComponentFactory(TestEventComponent);
        let testfact: Array<any> = Object.assign([], this.state["childen"]);
        let n1: any = t1.newInstance();
        // let n2: any = t2.newInstance();
        let viewDict: Map<string, any> = new Map<string, any>();
        viewDict.set("view", n1);
        viewDict.set("data", {"data bbibibibi": 30});
        viewDict.set("props", {"getEntity": (testEntity) => {this.testcom = testEntity; }});
        // (n1 as TestEventComponent).data = {"data bbibibibi": 30};
        testfact.push(viewDict);
        // testfact.push(n2);
        this.setState({children: testfact});
    }

    onTestButClick = (event) => {
        (this.testcom as TestEventComponent).printData();
    }

    render() {
        return (
            <div>
                {
                    this.state["children"].map((item, key) => {
                        const ChildrenComponent = (item as Map<string, any>).get("view");
                        const viewData = (item as Map<string, any>).get("data");
                        // const ChildrenComponent = (item as IComponentFactory).newInstance();
                        return < ChildrenComponent key={key} data={viewData}/>;
                    })
                }
                <button onClick={this.onBtnClick}>hihihi</button>
                <button onClick={this.onTestButClick}>test entity</button>
                <TestEventComponent owner={this.owner} getEntity={(testEntity) => {this.testEntity = testEntity; }}/>
                <DecathlonCanvas width={200} height={100} owner={this.owner} getEntity={(testEntity) => {this.canvas = testEntity; }}/>
            </div>
        );
    }
}