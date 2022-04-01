import {HandsEstimator} from "./core/hands-estimator";
import {detectGesture, Gesture} from "./core/gesture-detector";
import {HandFigureScene} from "./hand-figure/hand-figure-scene";
import {Game} from "./game/game";
import {LandmarkList} from "@mediapipe/hands";

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
    const canvas = document.getElementById('hand-figure-canvas') as HTMLCanvasElement;

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

    handsEstimator.addListener(landmarks => {
        hand = landmarks;
        const gesture = detectGesture(landmarks);
        game.setGesture(gesture);
    });

    handsEstimator.start();

    const scene = new HandFigureScene(canvas);

    function animate() {
        requestAnimationFrame(animate);
        if (gameStartTime) {
            scene.setElbowAngle(getElbowAngle(gameStartTime));
        }
        scene.setGesture(pickedGesture);
        scene.update();
    }

    animate();
}

main();
