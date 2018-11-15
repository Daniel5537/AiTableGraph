import * as React from "react";
import {EventBase} from "../events/EventBase";
import {IEventDispatcher} from "../events/IEventDispatcher";
import {EventDispatcher} from "../events/EventDispatcher";

export interface IDecathlonEventDispatcher {
    componentEventBus: IEventDispatcher;
    entityAddEventListener(type: string, listener: Function, context: any): void;
    entityDispatchEvent(event: EventBase): void;
    entityRemoveEventListener(type: string, context: any): void;
}

export interface IDecathlonComponentProps {
    getEntity?: any;
    owner?: DecathlonComponent;
}

export class DecathlonComponent extends React.Component<IDecathlonComponentProps, {}> implements IDecathlonEventDispatcher {
    public visible: boolean = true;
    public width: number;
    public height: number;
    public x: number;
    public y: number;

    constructor(props, context) {
        super(props, context);
        const { getEntity } = props;
        if (typeof getEntity === "function") {
            getEntity(this);
        }
    }
    componentEventBus: IEventDispatcher = new EventDispatcher();

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
}