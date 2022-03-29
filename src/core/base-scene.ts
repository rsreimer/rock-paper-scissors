import {Color, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class BaseScene {
    protected scene: Scene;
    protected camera: PerspectiveCamera;
    protected renderer: WebGLRenderer;
    protected controls: OrbitControls;

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
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
