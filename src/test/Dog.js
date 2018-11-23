"use strict";
exports.__esModule = true;
// import {IObjectConstructor} from "../workflow/global/IObjectConstructor";
var Cat_1 = require("./Cat");
Cat_1.sayHi();
var Dog = /** @class */ (function () {
    function Dog(name, age) {
        this.name = name;
        this.age = age;
    }
    Dog.prototype.say = function () {
        console.log(this.age);
    };
    Dog.prototype.getSelf = function () {
        return new Dog(this.name, this.age);
    };
    return Dog;
}());
exports.Dog = Dog;
