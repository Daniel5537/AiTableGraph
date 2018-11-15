import {IFactory} from "./IFactory";
import {IObjectConstructor} from "./IObjectConstructor";

export class ClassFactory implements IFactory {
    public classEntity: IObjectConstructor;
    constructor(c: IObjectConstructor) {
        this.classEntity = c;
    }

    public newInstance<T>(): T {
        return new this.classEntity<T>();
    }
}