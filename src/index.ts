import {HandsEstimator} from "./core/hands-estimator";
import {Results} from "@mediapipe/hands";
import {ResultsHandler} from "./core/results-handler";
import {GestureDetector, getGestureName} from "./core/gesture-detector";
import {StickFigureScene} from "./stick-figure/stick-figure-scene";
import {paper2} from "./test-data/test-gestures";
import {VideoScene} from "./video/video-scene";

export function main() {
    let currentResults: Results | null = {
        multiHandLandmarks: [
            paper2
        ],
        multiHandedness: [],
        image: null as any,
        multiHandWorldLandmarks: []
    };

    const gestureDetector = new GestureDetector();
    const handsEstimator = new HandsEstimator();

    document.getElementById('btn')!.addEventListener('click', () => {
        console.log(currentResults)
    })

    const detectionOutput = document.getElementById('detection')!;

    handsEstimator.addListener(results => currentResults = results);
    handsEstimator.start();

    const handlers: ResultsHandler[] = [
        new StickFigureScene(document.getElementById('stick-figure-canvas') as HTMLCanvasElement),
        new VideoScene(document.getElementById('video-canvas') as HTMLCanvasElement),
    ]

    function animate() {
        requestAnimationFrame(animate);

        if (currentResults) {
            handlers.forEach(scene => scene.update(currentResults!));

            const gestures = currentResults
                .multiHandLandmarks
                .map(landmarks => gestureDetector.detect(landmarks))
                .map(gesture => getGestureName(gesture));

            detectionOutput.innerText = gestures.join(', ');
        }
    }

    animate();
}

main();
