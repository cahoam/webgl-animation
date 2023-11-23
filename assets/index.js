const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');
const objectsToDraw = [];
let angle = 0;

if (!gl) {
    console.error('WebGL não está disponível.');
}

class DrawableObject {
    constructor(vertices, colors, drawType, translation = {x: 0, y: 0}, rotation = 0, scale = {x: 1, y: 1}) {
        this.vertices = vertices;
        this.colors = colors;
        this.drawType = drawType;
        this.translation = translation;
        this.rotation = rotation;
        this.scale = scale;
        this.calculateCenter(this.vertices);
    }

    setTranslation(x, y) {
        this.translation.x = x;
        this.translation.y = y;
    }

    setRotation(angle) {
        this.rotation = angle;
    }

    setScale(x, y) {
        this.scale.x = x;
        this.scale.y = y;
    }

    calculateCenter() {
        const center = calculateCenter(this.vertices);
        this.center = center;
    }
}

function setupBuffer(vertices) {
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return vertexBuffer;
}

function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Erro na compilação do shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initWebGL() {
    const vertexShaderSource = `
        attribute vec2 a_position;
        attribute vec4 a_color;
        uniform vec2 u_translation;
        uniform float u_rotation;
        uniform vec2 u_scale;
        uniform vec2 u_center;
        varying vec4 v_color;
        precision mediump float;
        
        void main() {
            vec2 position = a_position - u_center;
        
            float cosRot = cos(u_rotation);
            float sinRot = sin(u_rotation);
            position = vec2(
                position.x * cosRot - position.y * sinRot,
                position.x * sinRot + position.y * cosRot
            );
        
            position = position * u_scale;        
        
            position = position + u_center;
        
            position = position + u_translation;
        
            gl_Position = vec4(position, 0.0, 1.0);
            v_color = a_color;
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        varying vec4 v_color;

        void main() {
            gl_FragColor = v_color;
        }
    `;

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
        console.error('Erro ao compilar shaders.');
        return;
    }

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);

    return shaderProgram;
}

function drawObject(object) {
    const vertexBuffer = setupBuffer(object.vertices);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, 'a_position'), 2, gl.FLOAT, false, 0, 0);

    const u_center = gl.getUniformLocation(shaderProgram, "u_center");
    gl.uniform2f(u_center, object.center.x, object.center.y);

    const u_translation = gl.getUniformLocation(shaderProgram, "u_translation");
    gl.uniform2f(u_translation, object.translation.x, object.translation.y);

    const u_rotation = gl.getUniformLocation(shaderProgram, "u_rotation");
    gl.uniform1f(u_rotation, object.rotation);

    const u_scale = gl.getUniformLocation(shaderProgram, "u_scale");
    gl.uniform2f(u_scale, object.scale.x, object.scale.y);

    gl.drawArrays(object.drawType, 0, object.vertices.length / 2);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.colors), gl.STATIC_DRAW);

    const colorAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_color');
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);    
}

function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    objectsToDraw[0].setTranslation(Math.sin(angle)/7, Math.max(0, Math.cos(angle)/7));
    objectsToDraw[1].setTranslation(Math.sin(angle + Math.PI)/14, Math.max(0, Math.cos(angle + Math.PI)/7));
    objectsToDraw[2].setTranslation(0,  Math.cos((angle * 2) + 0.2)/15);
    objectsToDraw[3].setTranslation(0,  Math.cos(angle * 2)/12);
    objectsToDraw[4].setTranslation(-Math.cos(angle + Math.PI)/8,   Math.cos((angle * 2) + 0.2)/15);
    objectsToDraw[4].setRotation(-Math.cos(angle + Math.PI) * (Math.PI / 8))

    if (Math.cos(angle) > 0) {
        objectsToDraw[0].setRotation(Math.cos((angle * 2) - (Math.PI / 2)) * Math.PI/4);
        objectsToDraw[1].setRotation(0);
    } else {
        objectsToDraw[0].setRotation(0);
        objectsToDraw[1].setRotation(Math.cos((angle * 2) - (Math.PI / 2)) * Math.PI/4);

    }
    angle += 0.02;

    objectsToDraw.forEach(drawObject);
    requestAnimationFrame(render);
}

function calculateCenter(vertices) {
    let sumX = 0, sumY = 0;
    for (let i = 0; i < vertices.length; i += 2) {
        sumX += vertices[i];
        sumY += vertices[i + 1];
    }
    return { x: sumX / (vertices.length / 2), y: sumY / (vertices.length / 2) };
}

const firstFeet = [
    -0.125,  -.65,
    -0.125, -0.5,
    .125, -0.5,
    .125,  -.65
];

const secondFeet = [
    -0.125, -0.65,
    -0.125, -.5,
    .125, -.5,
    .125, -0.65
];

const tronco = [
    0.125, 0,
    0.125, -.25,
    -0.125, -.25,
    -0.125, 0
]

const cabeca = [
    0.2, .45,
    0.2, .05,
    -0.2, .05,
    -0.2, .45
]

const hand = [
    0.05, -.25,
    0.05, -.15,
    -0.05, -.15,
    -0.05, -.25
]

const white = [
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0
];

const brown = [
    0.7, 0.5, 0.25, 1.0,
    0.7, 0.5, 0.25, 1.0,
    0.7, 0.5, 0.25, 1.0,
    0.7, 0.5, 0.25, 1.0,
];


const shaderProgram = initWebGL();
objectsToDraw.push(new DrawableObject(firstFeet, brown, gl.TRIANGLE_FAN));
objectsToDraw.push(new DrawableObject(secondFeet, white, gl.TRIANGLE_FAN));
objectsToDraw.push(new DrawableObject(tronco, white, gl.TRIANGLE_FAN));
objectsToDraw.push(new DrawableObject(cabeca, brown, gl.TRIANGLE_FAN));
objectsToDraw.push(new DrawableObject(hand, brown, gl.TRIANGLE_FAN));
render();
