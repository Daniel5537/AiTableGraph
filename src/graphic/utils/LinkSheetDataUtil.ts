import {CommConst} from "../consts/CommConst";

export class LinkSheetDataUtil {
    // 将nodes数据分step
    public static layerNodesDataForStep(nodes: Array<object>): Map<number, Array<object>> {
        let resultDict: Map<number, Array<object>> = new Map<number, Array<object>>();
        for (let nodeItem of nodes) {
            if (nodeItem["stepId"]) {
                if (resultDict.get(nodeItem["stepId"]) == null) {
                    resultDict.set(nodeItem["stepId"], [nodeItem]);
                } else {
                    let tmpItemArr: Array<object> = resultDict.get(nodeItem["stepId"]);
                    tmpItemArr.push(nodeItem);
                }
            }
        }
        return resultDict;
    }

    // 获取link sheet header初始化数据
    public static getStepHeaderInitDatas(orginalCollection: Array<any>): Array<any> {
        let resultCollection: Array<any> = [];
        for (let item of orginalCollection) {
            let stepItem: object = {};
            stepItem[CommConst.STEP_ID] = item[CommConst.STEP_ID];
            stepItem[CommConst.WIDTH] = item[CommConst.WIDTH];
            stepItem[CommConst.PERCENT_HEIGHT] = 100;
            // stepItem[CommConst.X] = item[CommConst.X];
            stepItem[CommConst.STEP_NAME] = item[CommConst.STEP_NAME];
            resultCollection.push(stepItem);
        }
        return resultCollection;
    }
}