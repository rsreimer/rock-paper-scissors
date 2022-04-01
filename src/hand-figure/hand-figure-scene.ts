import {Landmark, LandmarkList} from "@mediapipe/hands";
import {buildHandFigure} from "./hand-figure";
import {transformToXYPlane} from "../math/transform-to-x-y-plane";
import {getAngleBetween} from "../math/get-angle-between";
import {HandLandmarks} from "../core/hand-landmarks";
import {Color, Object3D, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Gesture} from "../core/gesture-detector";
import {paper, rock, scissors} from "../core/gesture-landmarks";

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

export class HandFigureScene {
    private handFigure = buildHandFigure();
    private scene: Scene;
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;
    private controls: OrbitControls;

    constructor(canvas: HTMLCanvasElement) {
        this.scene = new Scene();
        this.scene.background = new Color('white');

        const {width, height} = canvas.getBoundingClientRect();

        this.renderer = new WebGLRenderer({canvas});
        this.renderer.setSize(width, height);

        this.camera = new PerspectiveCamera();
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.controls = new OrbitControls(this.camera, canvas);
        this.scene.add(this.handFigure.anchor);
        this.camera.position.z = -150;
        this.camera.position.x = 150;
        this.camera.position.y = 150;
    }

    setGesture(gesture: Gesture | null) {
        if (gesture === Gesture.Scissors) this.setLandmarks(scissors);
        if (gesture === Gesture.Paper) this.setLandmarks(paper);
        if (gesture === Gesture.Rock) this.setLandmarks(rock);
    }

    setLandmarks(landmarks: LandmarkList) {
        landmarks = transformToXYPlane(landmarks);
        const handFigure = this.handFigure;

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
    }

    setElbowAngle(angle: number) {
        this.handFigure.anchor.rotation.z = angle;
    }

    update() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
