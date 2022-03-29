import {Vector3} from "three";
import {HAND_CONNECTIONS, Results} from "@mediapipe/hands";
import {buildStickFigure, StickFigure} from "./stick-figure";
import {BaseScene} from "../core/base-scene";
import {ResultsHandler} from "../core/results-handler";

export class StickFigureScene extends BaseScene implements ResultsHandler {
    private stickFigures: StickFigure[] = [];

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.build();
    }

    update(results: Results) {
        const stickFigure = this.stickFigures;

        if (!stickFigure || !results.multiHandLandmarks) {
            return;
        }

        results.multiHandLandmarks.forEach((landmarks, index) => {
            const stickFigure = this.stickFigures[index];

            stickFigure.nodes.forEach((node, i) => {
                const landmark = landmarks[i];

                node.position.x = landmark.x;
                node.position.y = landmark.y;
                node.position.z = landmark.z;
            })

            stickFigure.lines.forEach((line, i) => {
                const from = landmarks[HAND_CONNECTIONS[i][0]];
                const to = landmarks[HAND_CONNECTIONS[i][1]];

                line.geometry.setFromPoints([
                    new Vector3(from.x, from.y, from.z),
                    new Vector3(to.x, to.y, to.z),
                ]);
            })
        })

        this.render();
    }

    private build(hands = 2) {
        for (let i = 0; i < hands; i++) {
            const stickFigure = buildStickFigure();

            stickFigure.anchor.position.y = 100;

            this.stickFigures.push(stickFigure);
            this.scene.add(stickFigure.anchor);
        }
    }
}
