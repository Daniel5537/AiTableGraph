import {EventDispatcher} from "../events/EventDispatcher";
/**
 * Created by Daniel on 2018/9/27.
 */
export class EventBus extends EventDispatcher{
    private static _instance: EventBus;
    constructor(singleton: SingletonClass) {
        super();
        if (singleton == null)
            throw("this class is singleton");
    }

    public static getInstance():EventBus{
        if(EventBus._instance == null)
            EventBus._instance = new EventBus(new SingletonClass());

        return EventBus._instance;
    }
}

class SingletonClass{
    constructor() {
    }
}