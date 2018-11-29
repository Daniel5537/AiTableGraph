import {EventBase} from "./EventBase";
/**
 * Created by Daniel on 2018/9/26.
 */
export interface IEventDispatcher {
    addEventListener(type: string, listener: Function, context: any): void;
    dispatchEvent(event: EventBase): boolean;
    // hasEventListener(type:string):Boolean
    removeEventListener(type: string, context: any):  void;
    // willTrigger(type:string):Boolean
}