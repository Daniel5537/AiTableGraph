import {DecathlonComponent} from "../workflow/components/DecathlonComponent";
import {TestEventParentComponent} from "./TestEventParentComponent";
import * as React from "react";
import {PersonEvent} from "../events/PersonEvent";
// import {Cat} from "../test/Cat";
// import {Dog} from "../test/Dog";
// import {IFactory} from "../workflow/global/IFactory";
// import {ClassFactory} from "../workflow/global/ClassFactory";

export class TestEventGrandFatherComponent extends DecathlonComponent {
    private owner = this;
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this.entityAddEventListener(PersonEvent.TEST_EVENT, this.onChildEventHandler, this);
    }

    onChildEventHandler = (event: PersonEvent) => {
        console.log("爷爷级组件");
        // let cat1: Cat = new Cat("hihi", 2);
        // let cat2: Cat = new Cat("kiki", 3);
        // let dog1: Dog = new Dog("bibi", 4);
        // let dog2: Dog = new Dog("dada", 5);
        // let tmap1: Map<Cat, Dog> = new Map<Cat, Dog>();
        // tmap1.set(cat1, dog1);
        // tmap1.set(cat2, dog2);
        // let d1 = tmap1.get(cat1);
        // d1.say();
        // for (let i of tmap1.keys()){
        //     console.log(i);
        // }
        // let iftest: IFactory = new ClassFactory(Cat);
        // let cat1: Cat = iftest.newInstance();
        // cat1.say();
    }

    render() {
        return (
            <TestEventParentComponent ref="grand" owner={this.owner}/>
        );
    }
}