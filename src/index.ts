import {HandsEstimator} from "./core/hands-estimator";
import {Results} from "@mediapipe/hands";
import {VideoScene} from "./video/video-scene";
import {ResultsHandler} from "./core/results-handler";

export function main() {
    let currentResults: Results | null = null;

    const handsEstimator = new HandsEstimator();

    handsEstimator.addListener(results => currentResults = results);

    handsEstimator.start();

    const handlers: ResultsHandler[] = [
        new VideoScene(document.getElementById('video-canvas') as HTMLCanvasElement),
    ]

    function animate() {
        requestAnimationFrame(animate);

        if (currentResults) {
            handlers.forEach(scene => scene.update(currentResults!));
        }
    }

    animate();
}

main();
