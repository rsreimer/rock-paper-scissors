import {drawConnectors, drawLandmarks} from "@mediapipe/drawing_utils";
import {ResultsHandler} from "../core/results-handler";
import {HAND_CONNECTIONS, Results} from "@mediapipe/hands";

export class VideoScene implements ResultsHandler {
    constructor(private canvas: HTMLCanvasElement) {
    }

    update(results: Results) {
        const ctx = this.canvas.getContext('2d')!;

        ctx.save();
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(
            results.image, 0, 0, this.canvas.width, this.canvas.height);
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                drawConnectors(ctx, landmarks, HAND_CONNECTIONS,{color: '#00FF00', lineWidth: .5});
                drawLandmarks(ctx, landmarks, {color: '#FF0000', radius: .2});
            }
        }
        ctx.restore();
    }
}