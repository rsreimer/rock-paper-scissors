import {HandsEstimator} from "./core/hands-estimator";
import {detectGesture, Gesture} from "./core/gesture-detector";
import {HandFigureScene} from "./hand-figure/hand-figure-scene";
import {Game} from "./game/game";

export function main() {
    const gameOutput = document.getElementById('game-output')!;
    const gameStartBtn = document.getElementById('game-btn')!;
    const canvas = document.getElementById('hand-figure-canvas') as HTMLCanvasElement;

    let pickedGesture: Gesture | null = null;

    const handsEstimator = new HandsEstimator();

    const game = new Game(
        message => gameOutput.innerHTML = message,
        gesture => pickedGesture = gesture,
    );

    gameStartBtn.addEventListener('click', () => game.start())

    handsEstimator.addListener(landmarks => {
        const gesture = detectGesture(landmarks);
        game.setGesture(gesture);
    });

    handsEstimator.start();

    const scene = new HandFigureScene(canvas);

    function animate() {
        requestAnimationFrame(animate);
        scene.renderGesture(pickedGesture);
    }

    animate();
}

main();
