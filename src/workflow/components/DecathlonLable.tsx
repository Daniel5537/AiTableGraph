import {DecathlonComponent} from "./DecathlonComponent";
import * as React from "react";

export class DecathlonLable extends DecathlonComponent {
    private _text: string;
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: ""
        };
    }

    public set text(value: string) {
        this._text = value;
        this.setState({text: this._text});
    }

    public get text(): string {
        return this._text;
    }

    componentDidMount() {
    }

    render() {
        return (
            <p style={this.state["styleObject"]}>{this.state["text"]}</p>
        );
    }
}