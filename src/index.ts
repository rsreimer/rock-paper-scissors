import {HandsEstimator} from "./core/hands-estimator";
import {Results} from "@mediapipe/hands";
import {VideoScene} from "./video/video-scene";
import {ResultsHandler} from "./core/results-handler";
import {GestureDetector, getGestureName} from "./core/gesture-detector";
import {StickFigureScene} from "./stick-figure/stick-figure-scene";

export function main() {
    let currentResults: Results | null = null;

    const gestureDetector = new GestureDetector();
    const handsEstimator = new HandsEstimator();

    document.getElementById('btn')!.addEventListener('click',() => {
        console.log(currentResults)
    })

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

            //const gesture = gestureDetector.detect(currentResults.multiHandLandmarks);

            //if (gesture) console.log(getGestureName(gesture));
        }
    }

    animate();
}

main();
