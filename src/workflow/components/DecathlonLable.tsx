import {DecathlonComponent} from "./DecathlonComponent";
import * as React from "react";

export class DecathlonLable extends DecathlonComponent {
    private _styleObjLabel: object = {};
    private _text: string;
    private _fontSizeLable: number = 12;
    private _fontFamilyLable: string = "Microsoft yahei";
    private _colorLable: string = "#666";
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: "",
            styleObject: {}
        };
    }

    private setStyleObjLabel(key: string, value: any): void {
        let cloneStyleObj = Object.assign({}, this._styleObjLabel);
        cloneStyleObj[key] = value;
        this._styleObjLabel = cloneStyleObj;
    }

    public set styleObj(value: object) {
        this._styleObjLabel = value
        this.setState({styleObject: this._styleObjLabel});
    }

    public get styleObj() {
        return this._styleObjLabel;
    }

    public updateStyle(styleObj: object = null): void {
        if (this._styleObjLabel !== null) {
            this._styleObjLabel = styleObj;
            return;
        }
        this.setState({styleObject: this._styleObjLabel});
    }

    public set text(value: string) {
        this._text = value;
        this.setState({text: this._text});
    }

    public get text(): string {
        return this._text;
    }

    public set fontSize(value: number) {
        if (this._fontSizeLable === value)
            return;
        this._fontSizeLable = value;
        this.setStyleObjLabel("fontSize", this._fontSizeLable + "px");
    }

    public get fontSize(): number {
        return this._fontSizeLable;
    }

    public set fontFamily(value: string) {
        if (this._fontFamilyLable === value) return;
        this._fontFamilyLable = value;
        this.setStyleObjLabel("fontFamily", this._fontFamilyLable + "px");
    }

    public get fontFamily(): string {
        return this._fontFamilyLable;
    }

    public set Color(value: string) {
        if (this._colorLable === value) return;
        this._colorLable = value;
        this.setStyleObjLabel("color", value);
    }

    public get Color(): string {
        return this._colorLable;
    }

    render() {
        return (
            <p style={this.state["styleObject"]}>{this.state["text"]}</p>
        );
    }
}