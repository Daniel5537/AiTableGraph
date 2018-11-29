import {IEventDispatcher} from "../../../workflow/events/IEventDispatcher";
import {IGraph} from "../data/IGraph";
import {IVisualGraph} from "../visual/IVisualGraph";
import {IVisualNode} from "../visual/IVisualNode";
import {IGTree} from "../data/IGTree";
import {EntityMouseEvent} from "../../../workflow/events/EntityMouseEvent";

export interface ILayoutAlgorithm extends IEventDispatcher {
    bounds: any;    //Rectangle
    margin: number;
    vgraph: IVisualGraph;
    graph: IGraph;
    linkLength: number;
    autoFitEnabled: number;
    layoutChanged: boolean;
    animInProgress: boolean;
    disableAnimation: boolean;
    multiRoot: boolean;
    stree: IGTree;

    resetAll(): void;

    layoutPass(): boolean;

    multiRootLayoutPass(): boolean;

    refreshInit(): void;

    dragEvent(event: EntityMouseEvent, vn: IVisualNode): void;

    dragContinue(event: EntityMouseEvent, vn: IVisualNode): void;

    dropEvent(event: EntityMouseEvent, vn: IVisualNode): void;

    bgDragEvent(event: EntityMouseEvent): void;

    bgDragContinue(event: EntityMouseEvent): void;

    bgDropEvent(event: EntityMouseEvent): void;
}