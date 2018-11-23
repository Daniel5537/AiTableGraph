"use strict";
exports.__esModule = true;
var Cat = /** @class */ (function () {
    function Cat(name, age) {
        this.name = name;
        this.age = age;
    }
    Cat.prototype.say = function () {
        console.log(this.name);
    };
    return Cat;
}());
exports.Cat = Cat;
exports.sayHi = function () {
    console.log("hello");
};
