import {IDog} from "./IDog";
// import {IObjectConstructor} from "../workflow/global/IObjectConstructor";
import {sayHi} from "./Cat";
sayHi()
export class Dog implements IDog {
    public name: string;
    public age: number;

    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    public say(): void {
        console.log(this.age);
    }

    public getSelf(): IDog {
        return new Dog(this.name, this.age);
    }
}