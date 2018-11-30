import * as React from "react";
import {EventBase} from "../events/EventBase";
import {IEventDispatcher} from "../events/IEventDispatcher";
import {EventDispatcher} from "../events/EventDispatcher";
import {IDataRenderer} from "../../base/IDataRenderer";
import {EntityMouseEvent} from "../events/EntityMouseEvent";

export interface IDecathlonEventDispatcher {
    componentEventBus: IEventDispatcher;
    entityAddEventListener(type: string, listener: Function, context: any): void;
    entityDispatchEvent(event: EventBase): void;
    entityRemoveEventListener(type: string, context: any): void;
}

export interface IDecathlonComponentProps {
    getEntity?: any;
    owner?: DecathlonComponent;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    visible?: boolean;
    position?: string;
    data?: object;
    percentWidth?: number | string;
    percentHeight?: number | string;
}

export class DecathlonComponent extends React.Component<IDecathlonComponentProps, {}> implements IDecathlonEventDispatcher, IDataRenderer {
    private _visible: boolean = true;
    private _styleObj: object = {};
    private _width: number;
    private _height: number;
    private _x: number;
    private _y: number;
    private _position: string;
    private _data: object;
    private _fontSize: number = 12;
    private _fontFamily: string = "Microsoft yahei";
    private _color: string = "#666";
    protected _scale: number = 1;
    protected _scaleX: number = 1;
    protected _scaleY: number = 1;
    private _percentWidth: number | string;
    private _percentHeight: number | string;
    // private _minWidth: number;
    // private _minHeight: number;
    // private _maxWidth: number;
    // private _maxHeight: number;
    protected _doubleClickEnabled: boolean = true;

    constructor(props, context) {
        super(props, context);
        if (this.props) {
            const { getEntity } = props;
            if (typeof getEntity === "function") {
                getEntity(this);
            }
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

    public set data(value: object) {
        this._data = value;
    }

    public get data(): object {
        return this._data;
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

    public set scale(value: number) {
        if (this._scale === value) return;
        this._scale = value;
        this.setStyleObjValue("transform", `scale(${value}, ${value})`);
    }

    public get scale(): number {
        return this._scale;
    }

    public set scaleX(value: number) {
        if (this._scaleX === value) return;
        this._scaleX = value;
        this.setStyleObjValue("transform", `scaleX(${value})`);
    }

    public get scaleX(): number {
        return this._scaleX;
    }

    public set scaleY(value: number) {
        if (this._scaleY === value) return;
        this._scaleY = value;
        this.setStyleObjValue("transform", `scaleY(${value})`);
    }

    public get scaleY(): number {
        return this._scaleY;
    }

    public set fontSize(value: number) {
        if (this._fontSize === value)
            return;
        this._fontSize = value;
        this.setStyleObjValue("fontSize", this._fontSize + "px");
    }

    public get fontSize(): number {
        return this._fontSize;
    }

    public set fontFamily(value: string) {
        if (this._fontFamily === value) return;
        this._fontFamily = value;
        this.setStyleObjValue("fontFamily", this._fontFamily + "px");
    }

    public get fontFamily(): string {
        return this._fontFamily;
    }

    public set color(value: string) {
        if (this._color === value) return;
        this._color = value;
        this.setStyleObjValue("color", value);
    }

    public get color(): string {
        return this._color;
    }

    public set percentWidth(value: number | string) {
        if (this._percentWidth === value) return;
        this._percentWidth = value
    }

    public get percentWidth(): number | string {
        return this._percentWidth;
    }

    public set percentHeight(value: number | string) {
        if (this._percentHeight === value) return;
        this._percentHeight = value
    }

    public get percentHeight(): number | string {
        return this._percentHeight;
    }

    public set styleObj(value: object) {
        this._styleObj = value;
        this.setState({styleObject: this._styleObj});
    }

    public get styleObj(): object {
        return this._styleObj;
    }

    public set doubleClickEnabled(value: boolean) {
        this._doubleClickEnabled = value;
    }

    public get doubleClickEnabled(): boolean {
        return this._doubleClickEnabled;
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
        if (this.props.data)
            this._data = this.props.data;
    }

    entityAddEventListener(type: string, listener: Function, context: any) {
        this.componentEventBus.addEventListener(type, listener, context);
    }

    entityDispatchEvent(event: EventBase): void {
        if (event.target == null)
            event.target = this;

        this.componentEventBus.dispatchEvent(event);
        if (this.props.owner != null && event.bubbles) {
            // console.log(this.props.owner);
            this.props.owner.entityDispatchEvent(event);
        }
    }

    entityRemoveEventListener(type: string, context: any): void {
        this.componentEventBus.removeEventListener(type, context);
    }

    entityMouseEventDispatch = (event) => {
        switch (event.type) {
            case "click":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.CLICK, event.target));
                break;
            case "mousedown":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.MOUSE_DOWN, event.target));
                break;
            case "mousemove":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.MOUSE_MOVE, event.target));
                break;
            case "mouseup":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.MOUSE_UP, event.target));
                break;
            case "mouseover":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.MOUSE_OVER, event.target));
                break;
            case "mouseout":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.MOUSE_OUT, event.target));
                break;
            case "mouseenter":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.MOUSE_ENTER, event.target));
                break;
            case "mouseleave":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.MOUSE_LEAVE, event.target));
                break;
            case "doubleclick":
                this.entityDispatchEvent(new EntityMouseEvent(EntityMouseEvent.DOUBLE_CLICK, event.target));
                break;
        }
    }
}