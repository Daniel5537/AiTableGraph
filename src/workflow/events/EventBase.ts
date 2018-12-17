/**
 * Created by Daniel on 2018/9/25.
 */
export class EventBase {
    private _type: string;
    private _bubbles: boolean;
    private _cancelable: boolean;
    private _data: any;
    private _target: any;

    public set target(value: any) {
        this._target = value;
    }

    public get target(): any {
        return this._target;
    }

    public set data(value: any) {
        this._data = value;
    }

    public get data(): any {
        return this._data;
    }

    public get cancelable() {
        return this._cancelable;
    }

    public set cancelable(value: boolean) {
        this._cancelable = value;
    }

    public get bubbles(): boolean {
        return this._bubbles;
    }

    public set bubbles(value: boolean) {
        this._bubbles = value;
    }

    public get type(): string {
        return this._type;
    }

    public set type(value: string) {
        this._type = value;
    }

    constructor(type: string, bubbles: boolean= false, cancelable: boolean= false) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
    }

    clone(): EventBase {
        return new EventBase(this.type, this.bubbles, this.cancelable);
    }
}