import {IEventDispatcher} from "../events/IEventDispatcher";
import {EventBase} from "../events/EventBase";
import * as React from "react";
import {EventDispatcher} from "../events/EventDispatcher";
import {DecathlonComponent} from "./DecathlonComponent";
import {Mixin} from "react";

export interface IDecathlonEventDispatcher {
    componentEventBus: IEventDispatcher;
    entityAddEventListener(type: string, listener: Function, context: any): void;
    entityDispatchEvent(event: EventBase): void;
    entityRemoveEventListener(type: string, context: any): void;
}

export interface IDecathlonCanvasProps {
    getEntity?: any;
    owner?: DecathlonComponent;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    visible?: boolean;
    position?: string;
}

export class DecathlonCanvas extends React.Component<IDecathlonCanvasProps, {}> implements IDecathlonEventDispatcher {
    private _visible: boolean = true;
    private _styleObj: object = {};
    private _width: number;
    private _height: number;
    private _x: number;
    private _y: number;
    private _position: string;

    constructor(props, context) {
        super(props, context);
        const { getEntity } = props;
        if (typeof getEntity === "function") {
            getEntity(this);
        }

        this.state = {
            styleObject: {},
        };
    }

    private setStyleObjValue(key: string, value: any): void {
        let cloneStyleObj: object = Object.assign({}, this._styleObj);
        cloneStyleObj[key] = value;
        this._styleObj = cloneStyleObj;
    }

    public set y(value: number) {
        if (value === this._y)
            return;
        this._y = value;
        this.setStyleObjValue("top", this._y);
    }

    public get y(): number {
        return this._y;
    }

    public set x(value: number) {
        if (value === this._x)
            return;
        this._x = value;
        this.setStyleObjValue("left", this._x);
    }

    public get x(): number {
        return this._x;
    }

    public set height(value: number) {
        if (value === this._height)
            return;
        this._height = value;
        this.setStyleObjValue("height", this._height);
    }

    public get height(): number {
        return this._height;
    }

    public set width(value: number) {
        if (value === this._width)
            return;
        this._width = value;
        this.setStyleObjValue("width", this._width);
    }

    public get width(): number {
        return this._width;
    }

    public set visible(value: boolean) {
        this._visible = value;
        if (!value)
            this.setStyleObjValue("display", "none");
        else
            this.setStyleObjValue("display", "block");
    }

    public get visible(): boolean {
        return this._visible;
    }

    public set position(value: string) {
        if (value === this._position)
            return;

        if (value === "absolute" ||
            value === "fixed" ||
            value === "relative" ||
            value === "static" ||
            value === "inherit") {
            this._position = value;
            this.setStyleObjValue("position", this._position);
        }
    }

    public get position(): string {
        return this._position;
    }

    public set styleObj(value: object) {
        this._styleObj = value;
        this.setState({styleObject: this._styleObj});
    }

    public get styleObj(): object {
        return this._styleObj;
    }

    public updateStyle(styleObj: object = null): void {
        if (styleObj != null) {
            this.styleObj = styleObj;
            return;
        }
        this.setState({styleObject: this._styleObj});
    }

    componentEventBus: IEventDispatcher = new EventDispatcher();

    componentWillMount() {
        this._styleObj = {};
        if (this.props.x)
            this._styleObj["left"] = this.props.x;
        if (this.props.y)
            this._styleObj["top"] = this.props.y;
        if (this.props.position)
            this._styleObj["position"] = this.props.position;
        if (this.props.width)
            this._styleObj["width"] = this.props.width;
        if (this.props.height)
            this._styleObj["height"] = this.props.height;
    }

    entityAddEventListener(type: string, listener: Function, context: any) {
        this.componentEventBus.addEventListener(type, listener, context);
    }

    entityDispatchEvent(event: EventBase): void {
        if (event.target == null)
            event.target = this;

        this.componentEventBus.dispatchEvent(event);
        if (this.props.owner != null && event.bubbles) {
            console.log(this.props.owner);
            this.props.owner.entityDispatchEvent(event);
        }
    }

    entityRemoveEventListener(type: string, context: any): void {
        this.componentEventBus.removeEventListener(type, context);
    }

    public getChildEntity(thisEntity: any): any {
        return (childEntity) => {thisEntity = childEntity; };
    }

    render() {
        return(
            <div style={this.state["styleObject"]}>测试基组件</div>
        );
    }
}