import {Point} from "../../base/Point";

export class Geometry {
    public static midPointOfLine(p: Point, q: Point): Point {
        if (p != null && q != null) {
            return new Point((p.x + q.x) / 2.0, (p.y + q.y) / 2.0);
        }
        return null;
    }
}
