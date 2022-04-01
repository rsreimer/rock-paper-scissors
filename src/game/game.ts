import {Gesture} from "../core/gesture-detector";

function findWinner(player: Gesture, game: Gesture): string {
    if (player === Gesture.Unknown || game === Gesture.Unknown) {
        return "Unknown";
    }

    if (player === game) {
        return "Tie";
    }

    if (
        player === Gesture.Scissors && game === Gesture.Paper ||
        player === Gesture.Rock && game === Gesture.Scissors ||
        player === Gesture.Paper && game === Gesture.Rock
    ) {
        return "You won!";
    }

    return "You loose!";
}

export class Game {
    private interval: any;
    private gesture: Gesture = Gesture.Unknown;

    constructor(
        private onMessage: (message: string) => void,
        private onGesture: (gesture: Gesture | null) => void
    ) {
    }

    setGesture(gesture: Gesture) {
        this.gesture = gesture;
    }

    start() {
        clearInterval(this.interval);

        let countdown = 3;

        this.onGesture(Gesture.Rock);

        this.interval = setInterval(() => {
            countdown--;

            if (countdown == 0) {
                const pickedGesture = this.pickGesture(this.gesture);
                this.onGesture(pickedGesture);

                setTimeout(() => {
                    this.onMessage(findWinner(this.gesture, pickedGesture as number))
                }, 500)
                clearInterval(this.interval);
            }
        }, 1000);
    }

    private pickGesture(gesture: Gesture): Gesture | null {
        // Pick at random
        return [
            Gesture.Paper,
            Gesture.Rock,
            Gesture.Scissors
        ][Math.floor(Math.random() * 3)]
    }
}