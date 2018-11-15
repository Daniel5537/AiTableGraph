import {IEventDispatcher} from "./IEventDispatcher";
import {EventBase} from "./EventBase";
/**
 * Created by Daniel on 2018/9/26.
 */
export class EventDispatcher implements IEventDispatcher {
    private  _listeners: object = {};
    private _useWeakReference: boolean;

    constructor() {}

    public addEventListener(type: string, listener: Function, context: any, useWeakReference: boolean= false): void {
        this._useWeakReference = useWeakReference;
        let observers: Observer[] = this._listeners[type];
        if (!observers) {
            this._listeners[type] = [];
        }
        this._listeners[type].push(new Observer(listener, context));
    }

    public removeEventListener(type: string, listener: Function): void {
        let observers: Observer[] = this._listeners[type];
        if (!observers)
            return;

        for (let i = 0; i < observers.length; i++) {
            observers.splice(i, 1);
        }

        if (observers.length === 0) {
            delete this._listeners[type];
        }
    }

    public dispatchEvent(event: EventBase): boolean {
        let observers: Observer[] = this._listeners[event.type];
        if (!observers)
            return;

        for (let i = 0; i < observers.length; i++) {
            let observer = observers[i];
            observer.notify(event);
            if (this._useWeakReference) {
                this.removeEventListener(event.type, observer.callBack);
            }
        }
        return false;
    }
}

class Observer {
    private _callBack: Function = null;
    private _context: any = null;

    public get callBack(): Function {
        return this._callBack;
    }

    constructor(callBack: Function, context: any) {
        let self = this;
        self._callBack = callBack;
        self._context = context;
    }

    notify(...args: any[]): void {
        let self = this;
        self._callBack.call(self._context, ...args);
    }
}