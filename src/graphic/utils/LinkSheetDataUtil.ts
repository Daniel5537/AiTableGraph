export class LinkSheetDataUtil {
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
}