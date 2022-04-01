import {Landmark, LandmarkList, Results} from "@mediapipe/hands";
import {buildHandFigure, HandFigure} from "./hand-figure";
import {BaseScene} from "../core/base-scene";
import {ResultsHandler} from "../core/results-handler";
import {transformToXYPlane} from "../math/transform-to-x-y-plane";
import {getAngleBetween} from "../math/get-angle-between";
import {HandLandmarks} from "../core/hand-landmarks";
import {Object3D} from "three";

function getAngleBetweenLines([a1, a2]: [Landmark, Landmark], [b1, b2]: [Landmark, Landmark]) {
    return getAngleBetween({
            x: a2.x - a1.x,
            y: a2.y - a1.y,
            z: a2.z - a1.z,
        }, {
            x: b2.x - b1.x,
            y: b2.y - b1.y,
            z: b2.z - b1.z,
        },
    )
}

function rotateFinger(joints: Object3D[], landmarks: LandmarkList, landmarkIndexes: number[]) {
    joints.forEach((joint, i) => {
        joint.rotation.y = getAngleBetweenLines([
            landmarks[landmarkIndexes[i]],
            landmarks[landmarkIndexes[i + 1]],
        ], [
            landmarks[landmarkIndexes[i + 1]],
            landmarks[landmarkIndexes[i + 2]],
        ])
    })
}

export class HandFigureScene extends BaseScene implements ResultsHandler {
    private handFigures: HandFigure[] = [];

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.build();
    }

    update(results: Results) {
        const handFigures = this.handFigures;

        if (!handFigures || !results.multiHandLandmarks) {
            return;
        }

        results.multiHandLandmarks.forEach((landmarks, index) => {
            const handFigure = this.handFigures[index];

            landmarks = transformToXYPlane(landmarks);

            rotateFinger([
                handFigure.indexMcp,
                handFigure.indexPip,
                handFigure.indexDip
            ], landmarks, [
                HandLandmarks.Wrist,
                HandLandmarks.Index_finger_mcp,
                HandLandmarks.Index_finger_pip,
                HandLandmarks.Index_finger_dip,
                HandLandmarks.Index_finger_tip,
            ])

            rotateFinger([
                handFigure.middleMcp,
                handFigure.middlePip,
                handFigure.middleDip
            ], landmarks, [
                HandLandmarks.Wrist,
                HandLandmarks.Middle_finger_mcp,
                HandLandmarks.Middle_finger_pip,
                HandLandmarks.Middle_finger_dip,
                HandLandmarks.Middle_finger_tip,
            ])

            rotateFinger([
                handFigure.ringMcp,
                handFigure.ringPip,
                handFigure.ringDip
            ], landmarks, [
                HandLandmarks.Wrist,
                HandLandmarks.Ring_finger_mcp,
                HandLandmarks.Ring_finger_pip,
                HandLandmarks.Ring_finger_dip,
                HandLandmarks.Ring_finger_tip,
            ])

            rotateFinger([
                handFigure.pinkyMcp,
                handFigure.pinkyPip,
                handFigure.pinkyDip
            ], landmarks, [
                HandLandmarks.Wrist,
                HandLandmarks.Pinky_mcp,
                HandLandmarks.Pinky_pip,
                HandLandmarks.Pinky_dip,
                HandLandmarks.Pinky_tip,
            ])
        })

        this.render();
    }

    private build(hands = 1) {
        this.camera.position.z = 200;

        const handColors = [
            0x0000ff,
            0x00ffff,
        ]

        for (let i = 0; i < hands; i++) {
            const handFigure = buildHandFigure(handColors[i]);

            this.handFigures.push(handFigure);
            this.scene.add(handFigure.anchor);
        }
    }
}
