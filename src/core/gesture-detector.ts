import {LandmarkList} from "@mediapipe/hands";
import {transformToXYPlane} from "../math/transform-to-x-y-plane";
import {HandLandmarks} from "./hand-landmarks";

export function getGestureName(gesture: Gesture) {
    switch (gesture) {
        case Gesture.Rock:
            return 'Rock';
        case Gesture.Paper:
            return 'Paper';
        case Gesture.Scissors:
            return 'Scissors';
        case Gesture.Unknown:
            return 'Unknown';
    }
}

export enum Gesture {
    Unknown,
    Rock,
    Paper,
    Scissors
}

export class GestureDetector {
    detect(landmarks: LandmarkList): Gesture {
        landmarks = transformToXYPlane(landmarks);

        const isIndexStreched = landmarks[HandLandmarks.Index_finger_tip].x > landmarks[HandLandmarks.Index_finger_pip].x;
        const isMiddleStreched = landmarks[HandLandmarks.Middle_finger_tip].x > landmarks[HandLandmarks.Middle_finger_pip].x;
        const isRingStreched = landmarks[HandLandmarks.Ring_finger_tip].x > landmarks[HandLandmarks.Ring_finger_pip].x;
        const isPinkyStreched = landmarks[HandLandmarks.Pinky_tip].x > landmarks[HandLandmarks.Pinky_pip].x;

        if (isIndexStreched && isMiddleStreched && isRingStreched && isPinkyStreched) {
            return Gesture.Paper;
        }

        if (!isIndexStreched && !isMiddleStreched && !isRingStreched && !isPinkyStreched) {
            return Gesture.Rock;
        }

        if (isIndexStreched && isMiddleStreched) {
            return Gesture.Scissors;
        }

        return Gesture.Unknown;
    }
}