import {Gesture} from "../core/gesture-detector";

export class Game {
    private interval: any;
    private gesture: Gesture = Gesture.Unknown;

    constructor(
        private onMessage: (message: string) => void,
        private onGesture: (gesture: Gesture) => void
    ) {
    }

    setGesture(gesture: Gesture) {
        this.gesture = gesture;
    }

    start() {
        clearInterval(this.interval);

        let countdown = 3;

        this.onMessage(countdown.toString());

        this.interval = setInterval(() => {
            countdown--;

            this.onMessage(countdown.toString());

            if (countdown == 0) {
                this.onMessage('now');
                setTimeout(() => {
                    this.onGesture(this.getWinner(this.gesture));
                }, 200)
                clearInterval(this.interval);
            }
        }, 1000);
    }

    private getWinner(gesture: Gesture): Gesture {
        if (gesture === Gesture.Rock) return Gesture.Paper;
        if (gesture === Gesture.Paper) return Gesture.Scissors;
        if (gesture === Gesture.Scissors) return Gesture.Rock;

        // Pick at random
        return [
            Gesture.Paper,
            Gesture.Rock,
            Gesture.Scissors
        ][Math.floor(Math.random() * 3)]
    }
}