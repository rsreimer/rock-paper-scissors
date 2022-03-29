import {AxesHelper, GridHelper, Vector3} from "three";
import {HAND_CONNECTIONS, Results} from "@mediapipe/hands";
import {buildStickFigure, StickFigure} from "./stick-figure";
import {BaseScene} from "../core/base-scene";
import {ResultsHandler} from "../core/results-handler";
import {transformToXYPlane} from "../math/transform-to-x-y-plane";

export class StickFigureScene extends BaseScene implements ResultsHandler {
    private stickFigures: StickFigure[] = [];

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.build();
    }

    update(results: Results) {
        const stickFigures = this.stickFigures;

        if (!stickFigures || !results.multiHandLandmarks) {
            return;
        }

        results.multiHandLandmarks.forEach((landmarks, index) => {
            const stickFigure = this.stickFigures[index];

            landmarks = transformToXYPlane(landmarks);

            stickFigure.nodes.forEach((node, i) => {
                const landmark = landmarks[i];

                node.position.x = landmark.x * 100;
                node.position.y = landmark.y * 100;
                node.position.z = landmark.z * 100;
            })

            stickFigure.lines.forEach((line, i) => {
                const from = landmarks[HAND_CONNECTIONS[i][0]];
                const to = landmarks[HAND_CONNECTIONS[i][1]];

                line.geometry.setFromPoints([
                    new Vector3(100 * from.x, 100 * from.y, 100 * from.z),
                    new Vector3(100 * to.x, 100 * to.y, 100 * to.z),
                ]);
            })
        })

        this.render();
    }

    private build(hands = 2) {
        this.camera.position.x = 40;

        const grid = new GridHelper(100, 40);
        grid.rotation.x = Math.PI / 2;
        this.scene.add(grid);

        const axesHelper = new AxesHelper(100);
        this.scene.add(axesHelper);

        const handColors = [
            {boxColor: 0x00ff00, lineColor: 0x0000ff},
            {boxColor: 0x00ffff, lineColor: 0xff0000},
        ]

        for (let i = 0; i < hands; i++) {
            const {lineColor, boxColor} = handColors[i];
            const stickFigure = buildStickFigure(boxColor, lineColor);

            this.stickFigures.push(stickFigure);
            this.scene.add(stickFigure.anchor);
        }
    }
}
