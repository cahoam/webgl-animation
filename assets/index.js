const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');
const objectsToDraw = [];
let angle = 0;

if (!gl) {
    console.error('WebGL não está disponível.');
}

class DrawableObject {
    constructor(vertices, drawType, translation = {x: 0, y: 0}, rotation = 0, scale = {x: 1, y: 1}) {
        this.vertices = vertices;
        this.drawType = drawType;
        this.translation = translation;
        this.rotation = rotation;
        this.scale = scale;
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
        uniform vec2 u_translation;
        uniform float u_rotation;
        uniform vec2 u_scale;

        void main() {
            // Aplicar escala
            vec2 scaledPosition = a_position * u_scale;

            // Aplicar rotação
            float cosRot = cos(u_rotation);
            float sinRot = sin(u_rotation);
            vec2 rotatedPosition = vec2(
                scaledPosition.x * cosRot - scaledPosition.y * sinRot,
                scaledPosition.x * sinRot + scaledPosition.y * cosRot
            );

            // Aplicar translação
            vec2 position = rotatedPosition + u_translation;

            gl_Position = vec4(position, 0.0, 1.0);
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

    const u_translation = gl.getUniformLocation(shaderProgram, "u_translation");
    gl.uniform2f(u_translation, object.translation.x, object.translation.y);

    const u_rotation = gl.getUniformLocation(shaderProgram, "u_rotation");
    gl.uniform1f(u_rotation, object.rotation);

    const u_scale = gl.getUniformLocation(shaderProgram, "u_scale");
    gl.uniform2f(u_scale, object.scale.x, object.scale.y);

    gl.drawArrays(object.drawType, 0, object.vertices.length / 2);
}

function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    objectsToDraw[0].setTranslation(Math.sin(angle), Math.cos(angle));
    objectsToDraw[1].setTranslation(Math.cos(angle), Math.sin(angle));
    angle += -0.01;

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
