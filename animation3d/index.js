const mat4 = {
    create() {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    },

    perspective(fov, aspect, near, far) {
        const f = 1.0 / Math.tan(fov / 2);
        const nf = 1 / (near - far);
        return new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, 2 * far * near * nf, 0
        ]);
    },

    lookAt(eye, center, up) {
        const z = this.normalize([eye[0] - center[0], eye[1] - center[1], eye[2] - center[2]]);
        const x = this.normalize(this.cross(up, z));
        const y = this.cross(z, x);

        return new Float32Array([
            x[0], y[0], z[0], 0,
            x[1], y[1], z[1], 0,
            x[2], y[2], z[2], 0,
            -x[0] * eye[0] - x[1] * eye[1] - x[2] * eye[2],
            -y[0] * eye[0] - y[1] * eye[1] - y[2] * eye[2],
            -z[0] * eye[0] - z[1] * eye[1] - z[2] * eye[2],
            1
        ]);
    },

    translate(out, a, v) {
        const x = v[0], y = v[1], z = v[2];
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
        for (let i = 0; i < 12; i++) out[i] = a[i];
        return out;
    },

    rotateX(out, a, rad) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];

        out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; out[3] = a[3];
        out[4] = a10 * c + a20 * s;
        out[5] = a11 * c + a21 * s;
        out[6] = a12 * c + a22 * s;
        out[7] = a13 * c + a23 * s;
        out[8] = a20 * c - a10 * s;
        out[9] = a21 * c - a11 * s;
        out[10] = a22 * c - a12 * s;
        out[11] = a23 * c - a13 * s;
        out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
        return out;
    },

    rotateY(out, a, rad) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];

        out[0] = a00 * c - a20 * s;
        out[1] = a01 * c - a21 * s;
        out[2] = a02 * c - a22 * s;
        out[3] = a03 * c - a23 * s;
        out[4] = a[4]; out[5] = a[5]; out[6] = a[6]; out[7] = a[7];
        out[8] = a00 * s + a20 * c;
        out[9] = a01 * s + a21 * c;
        out[10] = a02 * s + a22 * c;
        out[11] = a03 * s + a23 * c;
        out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
        return out;
    },

    rotateZ(out, a, rad) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];

        out[0] = a00 * c + a10 * s;
        out[1] = a01 * c + a11 * s;
        out[2] = a02 * c + a12 * s;
        out[3] = a03 * c + a13 * s;
        out[4] = a10 * c - a00 * s;
        out[5] = a11 * c - a01 * s;
        out[6] = a12 * c - a02 * s;
        out[7] = a13 * c - a03 * s;
        out[8] = a[8]; out[9] = a[9]; out[10] = a[10]; out[11] = a[11];
        out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
        return out;
    },

    scale(out, a, v) {
        const x = v[0], y = v[1], z = v[2];
        out[0] = a[0] * x; out[1] = a[1] * x; out[2] = a[2] * x; out[3] = a[3] * x;
        out[4] = a[4] * y; out[5] = a[5] * y; out[6] = a[6] * y; out[7] = a[7] * y;
        out[8] = a[8] * z; out[9] = a[9] * z; out[10] = a[10] * z; out[11] = a[11] * z;
        out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
        return out;
    },

    multiply(out, a, b) {
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
        out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
        out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
        out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return out;
    },

    invert(out, a) {
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) return null;
        det = 1.0 / det;

        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return out;
    },

    transpose(out, a) {
        if (out === a) {
            const a01 = a[1], a02 = a[2], a03 = a[3];
            const a12 = a[6], a13 = a[7];
            const a23 = a[11];
            out[1] = a[4]; out[2] = a[8]; out[3] = a[12];
            out[4] = a01; out[6] = a[9]; out[7] = a[13];
            out[8] = a02; out[9] = a12; out[11] = a[14];
            out[12] = a03; out[13] = a13; out[14] = a23;
        } else {
            out[0] = a[0]; out[1] = a[4]; out[2] = a[8]; out[3] = a[12];
            out[4] = a[1]; out[5] = a[5]; out[6] = a[9]; out[7] = a[13];
            out[8] = a[2]; out[9] = a[6]; out[10] = a[10]; out[11] = a[14];
            out[12] = a[3]; out[13] = a[7]; out[14] = a[11]; out[15] = a[15];
        }
        return out;
    },

    normalize(v) {
        const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        if (len > 0.00001) {
            return [v[0] / len, v[1] / len, v[2] / len];
        }
        return [0, 0, 0];
    },

    cross(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    }
};

let gl, canvas;
let shaderProgram;
let projectionMatrix, viewMatrix;
let camera = {
    position: [0, 0, 100],
    rotation: { x: 0, y: 0 },
    distance: 100
};

let mouseDown = false;
let lastMouseX = 0, lastMouseY = 0;

let clock = { startTime: Date.now(), getDelta() {
    const now = Date.now();
    const delta = (now - this.lastTime) / 1000;
    this.lastTime = now;
    return delta;
}, lastTime: Date.now() };

let delta = 0;
const PI = Math.PI;

const colors = {
    black: [0x10/255, 0x07/255, 0x07/255],
    orange: [0xb4/255, 0x4b/255, 0x39/255],
    lightOrange: [0xe0/255, 0x7a/255, 0x57/255],
    white: [0xa4/255, 0x97/255, 0x89/255]
};

const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;

    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uNormalMatrix;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
        vec4 worldPosition = uModelMatrix * vec4(aPosition, 1.0);
        vPosition = worldPosition.xyz;
        vNormal = (uNormalMatrix * vec4(aNormal, 0.0)).xyz;
        gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
    }
`;

const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vPosition;

    uniform vec3 uColor;
    uniform vec3 uAmbientLight;
    uniform vec3 uDirectionalLightColor;
    uniform vec3 uDirectionalLightDirection;
    uniform vec3 uCameraPosition;
    uniform float uFogNear;
    uniform float uFogFar;
    uniform vec3 uFogColor;

    void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(-uDirectionalLightDirection);

        // Ambient
        vec3 ambient = uAmbientLight * uColor;

        // Diffuse (Lambertian)
        float diff = max(dot(normal, lightDir), 0.0);
        vec3 diffuse = uDirectionalLightColor * diff * uColor;

        // Combine lighting
        vec3 result = ambient + diffuse * 0.9;

        // Fog
        float depth = length(vPosition - uCameraPosition);
        float fogFactor = clamp((uFogFar - depth) / (uFogFar - uFogNear), 0.0, 1.0);
        result = mix(uFogColor, result, fogFactor);

        gl_FragColor = vec4(result, 1.0);
    }
`;

function createCubeGeometry(width, height, depth, offsetX = 0, offsetY = 0, offsetZ = 0) {
    const w = width / 2, h = height / 2, d = depth / 2;

    const vertices = [
        // Front
        -w + offsetX, -h + offsetY,  d + offsetZ,
            w + offsetX, -h + offsetY,  d + offsetZ,
            w + offsetX,  h + offsetY,  d + offsetZ,
        -w + offsetX,  h + offsetY,  d + offsetZ,
        // Back
        -w + offsetX, -h + offsetY, -d + offsetZ,
        -w + offsetX,  h + offsetY, -d + offsetZ,
            w + offsetX,  h + offsetY, -d + offsetZ,
            w + offsetX, -h + offsetY, -d + offsetZ,
        // Top
        -w + offsetX,  h + offsetY, -d + offsetZ,
        -w + offsetX,  h + offsetY,  d + offsetZ,
            w + offsetX,  h + offsetY,  d + offsetZ,
            w + offsetX,  h + offsetY, -d + offsetZ,
        // Bottom
        -w + offsetX, -h + offsetY, -d + offsetZ,
            w + offsetX, -h + offsetY, -d + offsetZ,
            w + offsetX, -h + offsetY,  d + offsetZ,
        -w + offsetX, -h + offsetY,  d + offsetZ,
        // Right
            w + offsetX, -h + offsetY, -d + offsetZ,
            w + offsetX,  h + offsetY, -d + offsetZ,
            w + offsetX,  h + offsetY,  d + offsetZ,
            w + offsetX, -h + offsetY,  d + offsetZ,
        // Left
        -w + offsetX, -h + offsetY, -d + offsetZ,
        -w + offsetX, -h + offsetY,  d + offsetZ,
        -w + offsetX,  h + offsetY,  d + offsetZ,
        -w + offsetX,  h + offsetY, -d + offsetZ
    ];

    const normals = [
        0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,  // Front
        0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1, // Back
        0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,  // Top
        0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0, // Bottom
        1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,  // Right
        -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0  // Left
    ];

    const indices = [
        0, 1, 2,   0, 2, 3,    // Front
        4, 5, 6,   4, 6, 7,    // Back
        8, 9, 10,  8, 10, 11,  // Top
        12, 13, 14, 12, 14, 15, // Bottom
        16, 17, 18, 16, 18, 19, // Right
        20, 21, 22, 20, 22, 23  // Left
    ];

    return { vertices, normals, indices };
}

class Mesh {
    constructor(geometry, color) {
        this.geometry = geometry;
        this.color = color;
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.scale = { x: 1, y: 1, z: 1 };
        this.children = [];
        this.parent = null;

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.vertices), gl.STATIC_DRAW);

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.normals), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geometry.indices), gl.STATIC_DRAW);

        this.indexCount = geometry.indices.length;
    }

    add(child) {
        this.children.push(child);
        child.parent = this;
    }

    getWorldMatrix(parentMatrix = mat4.create()) {
        const modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [this.position.x, this.position.y, this.position.z]);
        mat4.rotateX(modelMatrix, modelMatrix, this.rotation.x);
        mat4.rotateY(modelMatrix, modelMatrix, this.rotation.y);
        mat4.rotateZ(modelMatrix, modelMatrix, this.rotation.z);
        mat4.scale(modelMatrix, modelMatrix, [this.scale.x, this.scale.y, this.scale.z]);

        const worldMatrix = mat4.create();
        mat4.multiply(worldMatrix, parentMatrix, modelMatrix);
        return worldMatrix;
    }

    draw(parentMatrix = mat4.create()) {
        const worldMatrix = this.getWorldMatrix(parentMatrix);

        gl.uniformMatrix4fv(shaderProgram.uModelMatrix, false, worldMatrix);

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, worldMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(shaderProgram.uNormalMatrix, false, normalMatrix);

        gl.uniform3fv(shaderProgram.uColor, this.color);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(shaderProgram.aPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(shaderProgram.aNormal, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);

        for (let child of this.children) {
            child.draw(worldMatrix);
        }
    }
}

class Group {
    constructor() {
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.scale = { x: 1, y: 1, z: 1 };
        this.children = [];
        this.parent = null;
    }

    add(child) {
        this.children.push(child);
        child.parent = this;
    }

    getWorldMatrix(parentMatrix = mat4.create()) {
        const modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [this.position.x, this.position.y, this.position.z]);
        mat4.rotateX(modelMatrix, modelMatrix, this.rotation.x);
        mat4.rotateY(modelMatrix, modelMatrix, this.rotation.y);
        mat4.rotateZ(modelMatrix, modelMatrix, this.rotation.z);
        mat4.scale(modelMatrix, modelMatrix, [this.scale.x, this.scale.y, this.scale.z]);

        const worldMatrix = mat4.create();
        mat4.multiply(worldMatrix, parentMatrix, modelMatrix);
        return worldMatrix;
    }

    draw(parentMatrix = mat4.create()) {
        const worldMatrix = this.getWorldMatrix(parentMatrix);
        for (let child of this.children) {
            child.draw(worldMatrix);
        }
    }
}

class Hero {
    constructor() {
        this.status = "running";
        this.runningCycle = 0;
        this.mesh = new Group();
        this.body = new Group();
        this.mesh.add(this.body);

        // Torso
        const torsoGeom = createCubeGeometry(7, 7, 10);
        this.torso = new Mesh(torsoGeom, colors.orange);
        this.torso.position.z = 0;
        this.torso.position.y = 7;
        this.torso.rotation.x = -Math.PI / 8;
        this.body.add(this.torso);

        // Pants
        const pantsGeom = createCubeGeometry(9, 9, 5);
        this.pants = new Mesh(pantsGeom, colors.white);
        this.pants.position.z = -3;
        this.pants.position.y = 0;
        this.torso.add(this.pants);

        // Tail
        const tailGeom = createCubeGeometry(3, 3, 3, 0, 0, -2);
        this.tail = new Mesh(tailGeom, colors.lightOrange);
        this.tail.position.z = -4;
        this.tail.position.y = 5;
        this.torso.add(this.tail);

        // Head
        const headGeom = createCubeGeometry(10, 10, 13, 0, 0, 7.5);
        this.head = new Mesh(headGeom, colors.orange);
        this.head.position.z = 2;
        this.head.position.y = 11;
        this.body.add(this.head);

        // Cheeks
        const cheekGeom = createCubeGeometry(1, 4, 4);
        this.cheekR = new Mesh(cheekGeom, colors.lightOrange);
        this.cheekR.position.x = -5;
        this.cheekR.position.z = 7;
        this.cheekR.position.y = -2.5;
        this.head.add(this.cheekR);

        this.cheekL = new Mesh(cheekGeom, colors.lightOrange);
        this.cheekL.position.x = 5;
        this.cheekL.position.z = 7;
        this.cheekL.position.y = -2.5;
        this.head.add(this.cheekL);

        // Nose
        const noseGeom = createCubeGeometry(6, 6, 3);
        this.nose = new Mesh(noseGeom, colors.lightOrange);
        this.nose.position.z = 13.5;
        this.nose.position.y = 2.6;
        this.head.add(this.nose);

        // Mouth
        const mouthGeom = createCubeGeometry(4, 2, 4, 0, 0, 3);
        this.mouth = new Mesh(mouthGeom, colors.orange);
        this.mouth.position.z = 8;
        this.mouth.position.y = -4;
        this.mouth.rotation.x = Math.PI / 12;
        this.head.add(this.mouth);

        // Paws Front
        const pawFGeom = createCubeGeometry(3, 4, 3);
        this.pawFR = new Mesh(pawFGeom, colors.lightOrange);
        this.pawFR.position.x = -2.5;
        this.pawFR.position.z = 6;
        this.pawFR.position.y = 1.5;
        this.body.add(this.pawFR);

        this.pawFL = new Mesh(pawFGeom, colors.lightOrange);
        this.pawFL.position.x = 2.5;
        this.pawFL.position.z = 6;
        this.pawFL.position.y = 1.5;
        this.body.add(this.pawFL);

        // Paws Back
        const pawBGeom = createCubeGeometry(3, 3, 6);
        this.pawBL = new Mesh(pawBGeom, colors.lightOrange);
        this.pawBL.position.y = 1.5;
        this.pawBL.position.z = 0;
        this.pawBL.position.x = 5;
        this.body.add(this.pawBL);

        this.pawBR = new Mesh(pawBGeom, colors.lightOrange);
        this.pawBR.position.y = 1.5;
        this.pawBR.position.z = 0;
        this.pawBR.position.x = -5;
        this.body.add(this.pawBR);

        // Ears
        const earGeom = createCubeGeometry(7, 18, 2, 0, 9, 0);
        this.earL = new Mesh(earGeom, colors.orange);
        this.earL.position.x = 2;
        this.earL.position.z = 2.5;
        this.earL.position.y = 5;
        this.earL.rotation.z = -Math.PI / 12;
        this.head.add(this.earL);

        this.earR = new Mesh(earGeom, colors.orange);
        this.earR.position.x = -2;
        this.earR.position.z = 2.5;
        this.earR.position.y = 5;
        this.earR.rotation.z = Math.PI / 12;
        this.head.add(this.earR);

        // Eyes
        const eyeGeom = createCubeGeometry(2, 4, 4);
        this.eyeL = new Mesh(eyeGeom, colors.white);
        this.eyeL.position.x = 5;
        this.eyeL.position.z = 5.5;
        this.eyeL.position.y = 2.9;
        this.head.add(this.eyeL);

        const irisGeom = createCubeGeometry(0.6, 2, 2);
        this.irisL = new Mesh(irisGeom, colors.black);
        this.irisL.position.x = 1.2;
        this.irisL.position.y = 1;
        this.irisL.position.z = 1;
        this.eyeL.add(this.irisL);

        this.eyeR = new Mesh(eyeGeom, colors.white);
        this.eyeR.position.x = -5;
        this.eyeR.position.z = 5.5;
        this.eyeR.position.y = 2.9;
        this.head.add(this.eyeR);

        this.irisR = new Mesh(irisGeom, colors.black);
        this.irisR.position.x = -1.2;
        this.irisR.position.y = 1;
        this.irisR.position.z = 1;
        this.eyeR.add(this.irisR);

        // Initial position
        this.mesh.position.y = -15;
        this.mesh.rotation.y = Math.PI / 2;
    }

    run() {
        const s = parameters.speed;
        this.runningCycle += delta * s;
        const t = this.runningCycle;
        const p = parameters;

        // BODY
        this.body.position.y = 6 + Math.sin(t + p.bodyCycleOffset) * p.bodyYAmplitude;
        this.body.rotation.x = 0.2 + Math.sin(t + p.bodyCycleOffset) * p.bodyRotationAmplitude;

        // TORSO
        this.torso.rotation.x = Math.sin(t + p.torsoCycleOffset) * p.torsoRotationAmplitude;
        this.torso.position.y = 7 + Math.sin(t + p.torsoCycleOffset) * p.torsoYAmplitude;

        // MOUTH
        this.mouth.rotation.x = Math.PI / 16 + Math.cos(t) * p.mouthRotationAmplitude;

        // HEAD
        this.head.position.z = 2 + Math.sin(t + p.headCycleOffset) * p.headZAmplitude;
        this.head.position.y = 8 + Math.cos(t + p.headCycleOffset) * p.headYAmplitude;
        this.head.rotation.x = -0.2 + Math.sin(t + p.headCycleOffset + PI * 1.5) * p.headRotationAmplitude;

        // EARS
        this.earL.rotation.x = Math.cos(t + p.earLeftCycleOffset) * p.earLeftRotationAmplitude;
        this.earR.rotation.x = Math.cos(t + p.earRightCycleOffset) * p.earRightRotationAmplitude;

        // EYES
        const eyeScale = p.eyeMinScale + Math.abs(Math.cos(t * 0.5 + p.eyeCycleOffset)) * (p.eyeMaxScale - p.eyeMinScale);
        this.eyeR.scale.y = this.eyeL.scale.y = eyeScale;

        // TAIL
        this.tail.rotation.x = Math.cos(t + p.tailCycleOffset) * p.tailRotationAmplitude;

        // FRONT RIGHT PAW
        this.pawFR.position.y = 1.5 + Math.sin(t + p.pawFRCycleOffset) * p.pawFRAmplitudeY;
        this.pawFR.position.z = 6 - Math.cos(t + p.pawFRCycleOffset) * p.pawFRAmplitudeZ;
        this.pawFR.rotation.x = Math.cos(t + p.pawFRCycleOffset) * p.pawFRAnkleRotationAmplitude;

        // FRONT LEFT PAW
        this.pawFL.position.y = 1.5 + Math.sin(t + p.pawFLCycleOffset) * p.pawFLAmplitudeY;
        this.pawFL.position.z = 6 - Math.cos(t + p.pawFLCycleOffset) * p.pawFLAmplitudeZ;
        this.pawFL.rotation.x = Math.cos(t + p.pawFLCycleOffset) * p.pawFLAnkleRotationAmplitude;

        // BACK RIGHT PAW
        this.pawBR.position.y = 1.5 + Math.sin(t + p.pawBRCycleOffset) * p.pawBRAmplitudeY;
        this.pawBR.position.z = -Math.cos(t + p.pawBRCycleOffset) * p.pawBRAmplitudeZ;
        this.pawBR.rotation.x = Math.cos(t + p.pawBRCycleOffset + PI * 0.25) * p.pawBRAnkleRotationAmplitude;

        // BACK LEFT PAW
        this.pawBL.position.y = 1.5 + Math.sin(t + p.pawBLCycleOffset) * p.pawBLAmplitudeY;
        this.pawBL.position.z = -Math.cos(t + p.pawBLCycleOffset) * p.pawBLAmplitudeZ;
        this.pawBL.rotation.x = Math.cos(t + p.pawBLCycleOffset + PI * 0.25) * p.pawBLAnkleRotationAmplitude;
    }
}

const parameters = {
    speed: 6,

    pawFRAmplitudeY: 4,
    pawFRAmplitudeZ: 8,
    pawFRCycleOffset: 0.2,
    pawFRAnkleRotationAmplitude: PI / 2,

    pawFLAmplitudeY: 4,
    pawFLAmplitudeZ: 8,
    pawFLCycleOffset: -0.2,
    pawFLAnkleRotationAmplitude: PI / 2,

    pawBRAmplitudeY: 4,
    pawBRAmplitudeZ: 5,
    pawBRCycleOffset: -0.1 + PI,
    pawBRAnkleRotationAmplitude: PI / 2,

    pawBLAmplitudeY: 4,
    pawBLAmplitudeZ: 5,
    pawBLCycleOffset: 0.1 - PI,
    pawBLAnkleRotationAmplitude: PI / 2,

    bodyYAmplitude: 4,
    bodyCycleOffset: -PI / 2,
    bodyRotationAmplitude: PI * 0.12,

    torsoYAmplitude: 2,
    torsoCycleOffset: -PI / 2,
    torsoRotationAmplitude: PI * 0.12,

    tailRotationAmplitude: PI / 3,
    tailCycleOffset: PI / 2,

    headYAmplitude: 3,
    headZAmplitude: 4,
    headCycleOffset: -PI / 2,
    headRotationAmplitude: PI / 8,

    mouthRotationAmplitude: 0.6,
    mouthCycleOffset: PI,

    earRightRotationAmplitude: 0.8,
    earRightCycleOffset: -PI / 2 + 0.2,

    earLeftRotationAmplitude: 0.6,
    earLeftCycleOffset: -PI / 2,

    eyeMinScale: 0.1,
    eyeMaxScale: 1,
    eyeCycleOffset: -Math.PI / 4
};

function initWebGL() {
    canvas = document.getElementById('glCanvas');
    const container = document.getElementById('world');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    // gl.clearColor(0xd6/255, 0xea/255, 0xe6/255, 1.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize shader program:', gl.getProgramInfoLog(shaderProgram));
        return;
    }

    gl.useProgram(shaderProgram);

    shaderProgram.aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
    shaderProgram.aNormal = gl.getAttribLocation(shaderProgram, 'aNormal');
    gl.enableVertexAttribArray(shaderProgram.aPosition);
    gl.enableVertexAttribArray(shaderProgram.aNormal);

    shaderProgram.uModelMatrix = gl.getUniformLocation(shaderProgram, 'uModelMatrix');
    shaderProgram.uViewMatrix = gl.getUniformLocation(shaderProgram, 'uViewMatrix');
    shaderProgram.uProjectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
    shaderProgram.uNormalMatrix = gl.getUniformLocation(shaderProgram, 'uNormalMatrix');
    shaderProgram.uColor = gl.getUniformLocation(shaderProgram, 'uColor');
    shaderProgram.uAmbientLight = gl.getUniformLocation(shaderProgram, 'uAmbientLight');
    shaderProgram.uDirectionalLightColor = gl.getUniformLocation(shaderProgram, 'uDirectionalLightColor');
    shaderProgram.uDirectionalLightDirection = gl.getUniformLocation(shaderProgram, 'uDirectionalLightDirection');
    shaderProgram.uCameraPosition = gl.getUniformLocation(shaderProgram, 'uCameraPosition');
    shaderProgram.uFogNear = gl.getUniformLocation(shaderProgram, 'uFogNear');
    shaderProgram.uFogFar = gl.getUniformLocation(shaderProgram, 'uFogFar');
    shaderProgram.uFogColor = gl.getUniformLocation(shaderProgram, 'uFogColor');

    updateProjectionMatrix();

    gl.uniform3f(shaderProgram.uAmbientLight, 1.0, 1.0, 1.0);
    gl.uniform3f(shaderProgram.uDirectionalLightColor, 1.0, 1.0, 1.0);
    gl.uniform3f(shaderProgram.uDirectionalLightDirection, -8, 8, 8);
    gl.uniform1f(shaderProgram.uFogNear, 150);
    gl.uniform1f(shaderProgram.uFogFar, 300);
    gl.uniform3f(shaderProgram.uFogColor, 0xd6/255, 0xea/255, 0xe6/255);
}

function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function updateProjectionMatrix() {
    const aspect = canvas.width / canvas.height;
    projectionMatrix = mat4.perspective(50 * Math.PI / 180, aspect, 1, 2000);
    gl.uniformMatrix4fv(shaderProgram.uProjectionMatrix, false, projectionMatrix);
}

function initMouseControls() {
    canvas.addEventListener('mousedown', (e) => {
        mouseDown = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    canvas.addEventListener('mouseup', () => {
        mouseDown = false;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!mouseDown) return;

        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;

        camera.rotation.y += deltaX * 0.01;
        camera.rotation.x += deltaY * 0.01;

        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        updateCamera();
    });

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
}

function updateCamera() {
    const x = camera.distance * Math.sin(camera.rotation.y) * Math.cos(camera.rotation.x);
    const y = camera.distance * Math.sin(camera.rotation.x);
    const z = camera.distance * Math.cos(camera.rotation.y) * Math.cos(camera.rotation.x);

    camera.position = [x, y, z];
}

function handleResize() {
    const container = document.getElementById('world');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    updateProjectionMatrix();
}

let hero;

function render() {
    delta = clock.getDelta();
    hero.run();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    viewMatrix = mat4.lookAt(camera.position, [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv(shaderProgram.uViewMatrix, false, viewMatrix);
    gl.uniform3fv(shaderProgram.uCameraPosition, camera.position);
    hero.mesh.draw();
    requestAnimationFrame(render);
}

window.addEventListener('load', () => {
    initWebGL();
    initMouseControls();
    hero = new Hero();
    updateCamera();
    render();
    window.addEventListener('resize', handleResize);
});
