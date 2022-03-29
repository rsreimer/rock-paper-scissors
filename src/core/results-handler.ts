import {Results} from "@mediapipe/hands";

export interface ResultsHandler {
    update(results: Results): void;
}