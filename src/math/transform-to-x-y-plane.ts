import {Landmark, LandmarkList} from "@mediapipe/hands";
import {getAngleBetween} from "./get-angle-between";
import {HandLandmarks} from "../core/hand-landmarks";
import {rotateX, rotateY, rotateZ} from "./rotate";

export function transformToXYPlane(landmarks: LandmarkList): LandmarkList {
    // Copy array
    const xAxis: Landmark = {x: 1, y: 0, z: 0};
    const yAxis: Landmark = {x: 0, y: 1, z: 0};
    const zAxis: Landmark = {x: 0, y: 0, z: 1};

    // Translate hand so that wrist is at (0,0,0)
    const centered: LandmarkList = landmarks.map(landmark => {
        const wrist = landmarks[0];

        return {
            x: landmark.x - wrist.x,
            y: landmark.y - wrist.y,
            z: landmark.z - wrist.z,
            visibility: landmark.visibility
        }
    })

    const zAxisRotation = -getAngleBetween(xAxis, {
        x: centered[HandLandmarks.Pinky_mcp].x,
        y: centered[HandLandmarks.Pinky_mcp].y,
        z: 0
    });
    const zRotated = centered.map(landmark => rotateZ(landmark, zAxisRotation));

    const yAxisRotation = -getAngleBetween(xAxis, {
        x: zRotated[HandLandmarks.Pinky_mcp].x,
        y: 0,
        z: zRotated[HandLandmarks.Pinky_mcp].z
    });

    const yRotated = zRotated.map(landmark => rotateY(landmark, yAxisRotation));

    const xAxisRotation = -getAngleBetween(yAxis, {
        x: 0,
        y: yRotated[HandLandmarks.Index_finger_mcp].y,
        z: yRotated[HandLandmarks.Index_finger_mcp].z
    });

    const xRotated = yRotated.map(landmark => rotateX(landmark, xAxisRotation));

    console.log(yRotated[5], yRotated[17])

    return xRotated;
}