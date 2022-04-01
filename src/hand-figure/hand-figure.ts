import {BoxGeometry, Mesh, MeshBasicMaterial, Object3D} from "three";

export interface HandFigure {
    palm: Object3D;
    indexMcp: Object3D;
    indexPip: Object3D;
    indexDip: Object3D;
    middleMcp: Object3D;
    middlePip: Object3D;
    middleDip: Object3D;
    ringMcp: Object3D;
    ringPip: Object3D;
    ringDip: Object3D;
    pinkyMcp: Object3D;
    pinkyPip: Object3D;
    pinkyDip: Object3D;
    anchor: Object3D;
}

function buildJoint(): Object3D {
    return new Object3D();
}

function buildFingerSegment(width: number, boxColor: number): Mesh {
    const geometry = new BoxGeometry(width, 10, 10);

    const material = new MeshBasicMaterial({
        color: boxColor
    });

    const segment = new Mesh(geometry, material);

    segment.position.x = width / 2;

    return segment
}

function buildFinger(palm: Mesh, segmentWidth: number) {
    const first = buildFingerSegment(segmentWidth, 0x0000cc);
    const second = buildFingerSegment(segmentWidth, 0x0000aa);
    const third = buildFingerSegment(segmentWidth, 0x000077);

    const firstJoint = buildJoint();
    const secondJoint = buildJoint();
    const thirdJoint = buildJoint();

    palm.add(firstJoint);
    firstJoint.add(first);
    first.add(secondJoint)
    secondJoint.add(second);
    second.add(thirdJoint);
    thirdJoint.add(third);

    firstJoint.position.x = 55 / 2;
    secondJoint.position.x = segmentWidth / 2;
    thirdJoint.position.x = segmentWidth / 2;

    return [
        firstJoint,
        secondJoint,
        thirdJoint
    ];
}

export function buildHandFigure(): HandFigure {
    const palm = new Mesh(new BoxGeometry(55, 55, 10), new MeshBasicMaterial({
        color: 0x0000ff
    }));

    const index = buildFinger(palm, 17);
    index[0].position.y = 55 - 32.5;
    const middle = buildFinger(palm, 20);
    middle[0].position.y = 40 - 32.5;
    const ring = buildFinger(palm, 17);
    ring[0].position.y = 25 - 32.5;
    const pinky = buildFinger(palm, 12);
    pinky[0].position.y = 10 - 32.5;

    const anchor = new Object3D();
    anchor.add(palm);

    anchor.position.x = -150;
    palm.position.x = 150;

    return {
        palm,
        indexMcp: index[0],
        indexPip: index[1],
        indexDip: index[2],
        middleMcp: middle[0],
        middlePip: middle[1],
        middleDip: middle[2],
        ringMcp: ring[0],
        ringPip: ring[1],
        ringDip: ring[2],
        pinkyMcp: pinky[0],
        pinkyPip: pinky[1],
        pinkyDip: pinky[2],
        anchor
    }
}