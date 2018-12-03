import {VisualGraph} from "../../graphic/graphLayout/visual/VisualGraph";
import {DecathlonComponent} from "../../workflow/components/DecathlonComponent";
import {INode} from "../../graphic/graphLayout/data/INode";
import {IVisualNode} from "../../graphic/graphLayout/visual/IVisualNode";
import {EnhancedVisualNode} from "../../graphic/enhancedGraphLayout/visual/EnhancedVisualNode";

export class RelationVisualGraph extends VisualGraph {
    protected _viewToVEdgeRendererMap: Map<DecathlonComponent, DecathlonComponent>;
    constructor(props, context) {
        super(props, context);
        this._viewToVEdgeRendererMap = new Map<DecathlonComponent, DecathlonComponent>();
    }

    protected createVNode(n: INode): IVisualNode {

        let vnode: IVisualNode;

        vnode = new EnhancedVisualNode(this, n, n.id, null, n.data);

        if (this.newNodesDefaultVisible) {
            this.setNodeVisibility(vnode, true);
        }

        n.vnode = vnode;

        this._vnodes.set(vnode, vnode);

        return vnode;
    }
}