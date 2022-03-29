import {LandmarkList} from "@mediapipe/hands";
import {transformToXYPlane} from "./transform-to-x-y-plane";

export function getGestureName(gesture: Gesture | null) {
    switch (gesture) {
        case Gesture.Rock: return 'Rock';
        case Gesture.Paper: return 'Paper';
        case Gesture.Scissors: return 'Scissors';
        default: return 'Unknown';
    }
}

export enum Gesture {
    Rock,
    Paper,
    Scissors
}

export class GestureDetector {
    detect(landmarks: LandmarkList): Gesture | null {
        landmarks = transformToXYPlane(landmarks);

        return null;
    }
}