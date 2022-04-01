import {HandsEstimator} from "./core/hands-estimator";
import {Results} from "@mediapipe/hands";
import {ResultsHandler} from "./core/results-handler";
import {GestureDetector, getGestureName} from "./core/gesture-detector";
import {scissors} from "./test-data/test-gestures";
import {HandFigureScene} from "./hand-figure/hand-figure-scene";

export function main() {
    let currentResults: Results | null = {
        multiHandLandmarks: [
            scissors
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

    // handsEstimator.addListener(results => currentResults = results);
    // handsEstimator.start();

    const handlers: ResultsHandler[] = [
        new HandFigureScene(document.getElementById('hand-figure-canvas') as HTMLCanvasElement),
        //new StickFigureScene(document.getElementById('stick-figure-canvas') as HTMLCanvasElement),
        //new VideoScene(document.getElementById('video-canvas') as HTMLCanvasElement),
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
