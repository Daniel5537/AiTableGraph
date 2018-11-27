import {IVisualNode} from "../graphic/graphLayout/visual/IVisualNode";
import {IVisualEdge} from "../graphic/graphLayout/visual/IVisualEdge";

export class Cat {
    public name: string;
    public age: number;

    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    public say(): void {
        console.log(this.name);
    }

    dispatchEvent(event: EventBase): boolean {
        return false;
    }

    draw(flags: number): void {
    }

    getSnapshotBeforeUpdate(prevProps: Readonly<IDecathlonComponentProps>, prevState: Readonly<{}>): any | null {
        return undefined;
    }

    initFromGraph(): void {
    }

    linkNodes(v1: IVisualNode, v2: IVisualNode): IVisualEdge {
        return undefined;
    }

    redrawEdges(): void {
    }

    redrawNodes(): void {
    }

    refresh(): void {
    }

    removeEventListener(type: string, context: any): void {
    }

    removeNode(vn: IVisualNode): void {
    }

    scroll(sx: number, sy: number, reset: boolean): void {
    }

    shouldComponentUpdate(nextProps: Readonly<IDecathlonComponentProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        return false;
    }

    unlinkNodes(v1: IVisualNode, v2: IVisualNode): void {
    }
}

export let sayHi = function(): void {
    console.log("hello");
}
