import {HandsEstimator} from "./core/hands-estimator";
import {detectGesture, Gesture} from "./core/gesture-detector";
import {HandFigureScene} from "./hand-figure/hand-figure-scene";
import {Game} from "./game/game";
import {LandmarkList, Results} from "@mediapipe/hands";
import {VideoScene} from "./video/video-scene";

function getElbowAngle(startMs: number) {
    const currentMs = new Date().getTime() - startMs;
    const cycles = currentMs / 1000;

    if (cycles > 3) {
        return 0;
    }

    const period = (cycles % 1);

    const maxAngle = Math.PI / 6;

    return Math.abs(Math.sin(period * Math.PI)) * maxAngle;
}

export function main() {
    const gameOutput = document.getElementById('game-output')!;
    const gameScore = document.getElementById('game-score')!;
    const gameStartBtn = document.getElementById('game-btn')!;
    const videoCanvas = document.getElementById('video-canvas') as HTMLCanvasElement;
    const handCanvas = document.getElementById('hand-figure-canvas') as HTMLCanvasElement;

    let results: Results | null = null;
    let hand: LandmarkList | null = null;
    let pickedGesture: Gesture | null = Gesture.Rock;

    const handsEstimator = new HandsEstimator();

    const game = new Game(
        message => gameOutput.innerHTML = message,
        gesture => pickedGesture = gesture,
        (playerWins, gameWins) => gameScore.innerHTML = `You: ${playerWins} - Game: ${gameWins}`
    );

    let gameStartTime: number | null = null;

    gameStartBtn.addEventListener('click', () => {
        console.log(hand)
        game.start();
        gameStartTime = new Date().getTime();
    })

    handsEstimator.addListener(r => {
        results = r;

        const landmarks = r?.multiHandLandmarks[0];

        if (landmarks) {
            hand = landmarks;

            const gesture = detectGesture(landmarks);
            game.setGesture(gesture);
        }
    });

    handsEstimator.start();

    const scene = new HandFigureScene(handCanvas);
    const videoScene = new VideoScene(videoCanvas);

    function animate() {
        requestAnimationFrame(animate);
        if (gameStartTime) {
            scene.setElbowAngle(getElbowAngle(gameStartTime));
        }
        scene.setGesture(pickedGesture);
        scene.update();

        if (results) videoScene.update(results);
    }

    animate();
}

main();
