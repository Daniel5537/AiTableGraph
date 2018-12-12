import {DecathlonCanvas} from "../../workflow/components/DecathlonCanvas";
import {DecathlonComponent, IDecathlonComponentProps} from "../../workflow/components/DecathlonComponent";
import * as React from "react";
import "./StepContainer.scss";

export class StepContainer extends DecathlonComponent {
    protected _stepId: number;
    constructor(props, context) {
        super(props, context);
        this.state = {
            stepName: this.props["stepName"],
            nodesElement: [],
            nodesContainer: []
        };
    }

    public removeNodeView(view: DecathlonComponent): void {
        let cloneNodeElement: Array<object> = Object.assign([], this.state["nodesElement"]);
        for (let nodeElement of cloneNodeElement) {
            // if ()
        }
    }

    public set stepId(value: number) {
        this._stepId = value;
    }

    public get stepId(): number {
        return this._stepId;
    }

    render() {
        return (
            <DecathlonCanvas>
                <p className="setpName">{this.state["hihi"]}</p>
                <button>dedede</button>
                {
                    this.state["nodesContainer"].map((item, key) => {
                        const ChildrenComponent = (item as Map<string, any>).get("view");
                        const stepProps = (item as Map<string, any>).get("props");
                        return < ChildrenComponent key={key} {...stepProps}/>;
                    })
                }
            </DecathlonCanvas>
        );
    }
}