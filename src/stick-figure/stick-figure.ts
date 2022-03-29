import {BoxGeometry, BufferGeometry, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, Object3D} from "three";
import {HAND_CONNECTIONS} from "@mediapipe/hands";

export interface StickFigure {
    nodes: Mesh[];
    lines: Line[];
    anchor: Object3D;
}

export function buildStickFigure() {
    const nodes = new Array(21).fill(null).map((x, i) => {
        const material = new MeshBasicMaterial({
            color: 0x00ff00
        });
        const geometry = i == 5 || i == 17 ? new BoxGeometry() : new BoxGeometry(0, 0, 0);
        return new Mesh(geometry, material);
    })

    const lines = HAND_CONNECTIONS.map(() => {
        const material = new LineBasicMaterial({
            color: 0x0000ff,
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