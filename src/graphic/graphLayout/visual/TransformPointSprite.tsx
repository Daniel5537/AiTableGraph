import {DecathlonCanvas} from "../../../workflow/components/DecathlonCanvas";
import {IDecathlonComponentProps} from "../../../workflow/components/DecathlonComponent";
import {EntityMouseEvent} from "../../../workflow/events/EntityMouseEvent";
import {CompassQuadrant} from "../../consts/CompassQuadrant";
import * as React from "react";
import "./TransformPointSprite.scss";

export class TransformPointSprite extends DecathlonCanvas<IDecathlonComponentProps> {
    protected _transfrormCompass: string;
    constructor(props, context) {
        super(props, context);
        if (props["transfrormCompass"]) {
            this._transfrormCompass = props["transfrormCompass"];
        }
    }

    public get transfrormCompass(): string {
        return this._transfrormCompass;
    }

    componentDidMount() {
        this.entityAddEventListener(EntityMouseEvent.MOUSE_OVER, this.onMouseRollOverHandler, this);
        this.entityAddEventListener(EntityMouseEvent.MOUSE_OUT, this.onMouseRollOutHandler, this);
    }

    onMouseRollOverHandler = (event) => {
        let cloneStyle: object = Object.assign({}, this.styleObj);
        switch (this._transfrormCompass) {
            case CompassQuadrant.NORTH:
            case CompassQuadrant.SOUTH:
                cloneStyle["cursor"] = "s-resize";
                break;
            case CompassQuadrant.EAST:
            case CompassQuadrant.WEST:
                cloneStyle["cursor"] = "w-resize";
                break;
            case CompassQuadrant.NORTH_WEST:
            case CompassQuadrant.SOUTH_EAST:
                cloneStyle["cursor"] = "se-resize";
                break;
            case CompassQuadrant.NORTH_EAST:
            case CompassQuadrant.SOUTH_WEST:
                cloneStyle["cursor"] = "ne-resize";
                break;
        }
        this.updateStyle(cloneStyle);
    }

    onMouseRollOutHandler = (event) => {
        let cloneStyle: object = Object.assign({}, this.styleObj);
        cloneStyle["cursor"] = "default";
        this.updateStyle(cloneStyle);
    }
}