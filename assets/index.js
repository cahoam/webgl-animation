const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');
const objectsToDraw = [];

if (!gl) {
    console.error('WebGL não está disponível.');
}

class DrawableObject {
    constructor(vertices, drawType) {
        this.vertices = vertices;
        this.drawType = drawType;
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
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
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
    gl.drawArrays(object.drawType, 0, object.vertices.length / 2);
}

function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    objectsToDraw.forEach(drawObject);
    requestAnimationFrame(render);
}

const squareVertices = [
    0.5,  .75,
    0.5, 0.5,
    .75, 0.5,
    .75,  .75
];

const triangleVertices = [
    0.0,  0.15,
   -0.15, -0.15,
    0.15, -0.15
];

const shaderProgram = initWebGL();
objectsToDraw.push(new DrawableObject(squareVertices, gl.TRIANGLE_FAN));
objectsToDraw.push(new DrawableObject(triangleVertices, gl.TRIANGLES));
render();
