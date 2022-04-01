import {AxesHelper, GridHelper} from "three";
import {Results} from "@mediapipe/hands";
import {buildHandFigure, HandFigure} from "./hand-figure";
import {BaseScene} from "../core/base-scene";
import {ResultsHandler} from "../core/results-handler";
import {transformToXYPlane} from "../math/transform-to-x-y-plane";

export class HandFigureScene extends BaseScene implements ResultsHandler {
    private handFigures: HandFigure[] = [];

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.build();
    }

    update(results: Results) {
        const handFigures = this.handFigures;

        if (!handFigures || !results.multiHandLandmarks) {
            return;
        }

        results.multiHandLandmarks.forEach((landmarks, index) => {
            const handFigure = this.handFigures[index];

            landmarks = transformToXYPlane(landmarks);
        })

        this.render();
    }

    private build(hands = 1) {
        this.camera.position.z = 100;

        const grid = new GridHelper(100, 40);
        grid.rotation.x = Math.PI / 2;
        //this.scene.add(grid);

        const axesHelper = new AxesHelper(100);
        //this.scene.add(axesHelper);

        const handColors = [
            0x0000ff,
            0x00ffff,
        ]

        for (let i = 0; i < hands; i++) {
            const handFigure = buildHandFigure(handColors[i]);

            this.handFigures.push(handFigure);
            this.scene.add(handFigure.anchor);
        }
    }
}
