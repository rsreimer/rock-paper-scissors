import {BoxGeometry, BufferGeometry, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, Object3D} from "three";
import {HAND_CONNECTIONS} from "@mediapipe/hands";

export interface StickFigure {
    nodes: Mesh[];
    lines: Line[];
    anchor: Object3D;
}

export function buildStickFigure(boxColor = 0x00ff00, lineColor = 0x0000ff) {
    const nodes = new Array(21).fill(null).map((x, i) => {
        const material = new MeshBasicMaterial({
            color: boxColor
        });
        const geometry = new BoxGeometry();
        return new Mesh(geometry, material);
    })

    const lines = HAND_CONNECTIONS.map(() => {
        const material = new LineBasicMaterial({
            color: lineColor,
        });
        const geometry = new BufferGeometry();
        return new Line(geometry, material);
    });

    const anchor = new Object3D();
    anchor.add(...lines);
    anchor.add(...nodes);

    return {
        nodes,
        lines,
        anchor
    }
}