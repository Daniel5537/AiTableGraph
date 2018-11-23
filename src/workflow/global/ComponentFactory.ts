import {IObjectConstructor} from "./IObjectConstructor";
import {IComponentFactory} from "./IComponentFactory";

export class ComponentFactory implements IComponentFactory {
    public classEntity: any;
    // public dynamicProps: object;
    // public dynamicContext: object;
    constructor(c: any) {
        this.classEntity = c;
        // this.dynamicProps = p;
        // this.dynamicContext = context;
    }

    // public newInstance<T>(props: object, context?: any): T {
    //     return new this.classEntity<T>(props: object, context?: any);
    // }

    public newInstance(): any {
        return this.classEntity;
        // return new this.classEntity(this.dynamicProps, this.dynamicContext);
    }
}