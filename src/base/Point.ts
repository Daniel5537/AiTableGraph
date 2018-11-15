export class Point {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public set x(value: number) {
        this._x = value;
    }

    public get x(): number {
        return this._x;
    }

    public set y(value: number) {
        this._y = value;
    }

    public get y(): number {
        return this._y;
    }
}