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

        const index = [HandLandmarks.Index_finger_mcp, HandLandmarks.Index_finger_pip, HandLandmarks.Index_finger_dip, HandLandmarks.Index_finger_tip];
        const middle = [HandLandmarks.Middle_finger_mcp, HandLandmarks.Middle_finger_pip, HandLandmarks.Middle_finger_dip, HandLandmarks.Middle_finger_tip];
        const ring = [HandLandmarks.Ring_finger_mcp, HandLandmarks.Ring_finger_pip, HandLandmarks.Ring_finger_dip, HandLandmarks.Ring_finger_tip];
        const pinky = [HandLandmarks.Pinky_mcp, HandLandmarks.Pinky_pip, HandLandmarks.Pinky_dip, HandLandmarks.Pinky_tip];

        const isIndexStreched = this.isFingerStretched(landmarks, index);
        const isMiddleStreched = this.isFingerStretched(landmarks, middle);
        const isRingStreched = this.isFingerStretched(landmarks, ring);
        const isPinkyStreched = this.isFingerStretched(landmarks, pinky);

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

    private isFingerStretched(landmarks: LandmarkList, finger: number[]): boolean {
        return landmarks[finger[0]].x < landmarks[finger[1]].x && landmarks[finger[1]] < landmarks[finger[3]];
    }
}