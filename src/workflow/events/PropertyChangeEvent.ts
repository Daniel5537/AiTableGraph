import {EventBase} from "./EventBase";
import {PropertyChangeEventKind} from "./PropertyChangeEventKind";

export class PropertyChangeEvent extends EventBase{
    public static PROPERTY_CHANGE:string = "propertyChange";
    public kind:string;
    public newValue:object;
    public oldValue:object;
    public property:object;
    public source:object;

    constructor(type:string,
                bubbles:boolean=false,
                cancelable:boolean=false,
                kind:string=null,
                property:object=null,
                oldValue:object=null,
                newValue:object=null,
                source:object=null){
        super(type, bubbles, cancelable);

        this.kind = kind;
        this.property = property;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.source = source;
    }

    public static createUpdateEvent(source:object,
                                    property:object,
                                    oldValue:object=null,
                                    newValue:object):PropertyChangeEvent{
        let event:PropertyChangeEvent = new PropertyChangeEvent(this.PROPERTY_CHANGE);

        event.kind = PropertyChangeEventKind.UPDATE;
        event.oldValue = oldValue;
        event.newValue = newValue;
        event.source = source;
        event.property = property;

        return event;
    }

    clone():EventBase{
        return new PropertyChangeEvent(this.type, this.bubbles, this.cancelable, this.kind,
            this.property, this.oldValue, this.newValue, this.source)
    }
}