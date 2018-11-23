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
}

export let sayHi = function(): void {
    console.log("hello");
}
