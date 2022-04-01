import {LandmarkList} from "@mediapipe/hands";
import {transformToXYPlane} from "../math/transform-to-x-y-plane";
import {HandLandmarks} from "./hand-landmarks";

export enum Gesture {
    Unknown,
    Rock,
    Paper,
    Scissors
}

function isFingerStretched(landmarks: LandmarkList, finger: number[]): boolean {
    return landmarks[finger[0]].x < landmarks[finger[1]].x && landmarks[finger[1]].x < landmarks[finger[3]].x;
}

export function detectGesture(landmarks: LandmarkList | null): Gesture {
    if (!landmarks) {
        return Gesture.Unknown;
    }

    landmarks = transformToXYPlane(landmarks);

    const index = [HandLandmarks.Index_finger_mcp, HandLandmarks.Index_finger_pip, HandLandmarks.Index_finger_dip, HandLandmarks.Index_finger_tip];
    const middle = [HandLandmarks.Middle_finger_mcp, HandLandmarks.Middle_finger_pip, HandLandmarks.Middle_finger_dip, HandLandmarks.Middle_finger_tip];
    const ring = [HandLandmarks.Ring_finger_mcp, HandLandmarks.Ring_finger_pip, HandLandmarks.Ring_finger_dip, HandLandmarks.Ring_finger_tip];
    const pinky = [HandLandmarks.Pinky_mcp, HandLandmarks.Pinky_pip, HandLandmarks.Pinky_dip, HandLandmarks.Pinky_tip];

    const isIndexStreched = isFingerStretched(landmarks, index);
    const isMiddleStreched = isFingerStretched(landmarks, middle);
    const isRingStreched = isFingerStretched(landmarks, ring);
    const isPinkyStreched = isFingerStretched(landmarks, pinky);

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
