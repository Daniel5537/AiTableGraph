import {IEventDispatcher} from "../../../workflow/events/IEventDispatcher";
import {IGraph} from "../data/IGraph";
import {IVisualGraph} from "../visual/IVisualGraph";
import {IVisualNode} from "../visual/IVisualNode";
import {IGTree} from "../data/IGTree";

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

    dragEvent(event: MouseEvent, vn: IVisualNode): void;

    dragContinue(event: MouseEvent, vn: IVisualNode): void;

    dropEvent(event: MouseEvent, vn: IVisualNode): void;

    bgDragEvent(event: MouseEvent): void;

    bgDragContinue(event: MouseEvent): void;

    bgDropEvent(event: MouseEvent): void;
}