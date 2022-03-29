import {LandmarkList} from "@mediapipe/hands";

export function transformToXYPlane(landmarks: LandmarkList): LandmarkList {
    // Copy array
    landmarks = landmarks.slice();

    const wrist = landmarks[0];
    const indexKnuckle = landmarks[5];
    const pinkyKnuckle = landmarks[17];

    // Translate hand so that wrist is at z = 0
    landmarks.forEach(landmark => {
        landmark.z -= wrist.z;
    })

    // Rotate hand so that palm is in X-Y plane
    //const yOffsetAngle =

    return landmarks;
}