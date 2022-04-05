import {Gesture} from "../core/gesture-detector";

export class Game {
    private interval: any;
    private gesture: Gesture = Gesture.Unknown;
    private gameWins = 0;
    private playerWins = 0;

    constructor(
        private onMessage: (message: string) => void,
        private onGesture: (gesture: Gesture | null) => void,
        private onGameEnd: (playerWins: number, gameWins: number) => void
    ) {
    }

    setGesture(gesture: Gesture) {
        this.gesture = gesture;
    }

    start() {
        clearInterval(this.interval);

        let countdown = 3;
        this.onMessage(`${countdown}...`)

        this.onGesture(Gesture.Rock);

        this.interval = setInterval(() => {
            countdown--;
            this.onMessage(`${countdown}...`)

            if (countdown == 0) {
                this.onMessage('&nbsp;')
                const pickedGesture = this.pickGesture(this.gesture);
                this.onGesture(pickedGesture);

                setTimeout(() => {
                    this.onMessage(this.findWinner(this.gesture, pickedGesture as number))
                }, 500)
                clearInterval(this.interval);
            }
        }, 1000);
    }

    private pickGesture(player: Gesture): Gesture | null {
        // Pick a gesture at random, could use player gesture to cheat though ...
        return [
            Gesture.Paper,
            Gesture.Rock,
            Gesture.Scissors
        ][Math.floor(Math.random() * 3)]
    }

    private findWinner(player: Gesture, game: Gesture): string {
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
            this.playerWins++;
            this.onGameEnd(this.playerWins, this.gameWins);
            return "You won!";
        }

        this.gameWins++;
        this.onGameEnd(this.playerWins, this.gameWins);
        return "You loose!";
    }
}