import {DecathlonComponent} from "../../../workflow/components/DecathlonComponent";
import {Point} from "../../../base/Point";
import {INode} from "../data/INode";
import {IVisualItem} from "./IVisualItem";

export interface IVisualNode extends IVisualItem {
    x: number;
    y: number;
    rawview: DecathlonComponent;
    view: DecathlonComponent;
    viewCenter: Point;
    viewX: number;
    viewY: number;
    node: INode;
    moveable: boolean;
    orientAngle: number;

    refresh(): void;

    commit(): void;
}