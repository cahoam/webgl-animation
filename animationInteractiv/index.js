const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');
const objectsToDraw = [];
let angle = 0;
let numberOfElements = 0;

let isCentering = true;

function toggleCentering() {
    isCentering = !isCentering;
}

function toggleSidebar() {
    var button = document.querySelector(".button");
    var sidebar = document.querySelector(".sidebar");
    var sidebarItems = document.querySelectorAll(".sidebar-item");
    
    button.classList.toggle("active");
    sidebar.classList.toggle("move-to-left");
    sidebarItems.forEach(function(item) {
        item.classList.toggle("active");
    });
}

function addElement(pol) {
    const colorMatrix = generateColorMatrix(poligons[pol].length/2 + 1);
    objectsToDraw.push(new DrawableObject(poligons[pol], colorMatrix, gl.TRIANGLE_FAN));

    const root = document.getElementById('elements');
    root.innerHTML += elementoWebGL(numberOfElements++);
}

function generateColorMatrix(polNumberVertices) {
    const matrixColor = [];

    const colorR = Math.random();
    const colorG = Math.random();
    const colorB = Math.random();

    for (let i = 0 ; i < polNumberVertices ; i++) {
        matrixColor.push(...[colorR, colorG, colorB, 1,]);
    }    

    return matrixColor;
}

function animation(id){
    const x = document.getElementById('x' + id);
    const y = document.getElementById('y' + id);
    const e = document.getElementById('e' + id);
    const r = document.getElementById('r' + id);

    objectsToDraw[id].setAnimation(
        parseFloat(x.value), 
        parseFloat(y.value),
        parseFloat(e.value),
        parseFloat(e.value),
        parseFloat(r.value)
    );
}

function updateCustomCode(id) {
    const codeTextarea = document.getElementById('customCode' + id);
    const errorDiv = document.getElementById('codeError' + id);

    if (codeTextarea && objectsToDraw[id]) {
        const result = objectsToDraw[id].setCustomCode(codeTextarea.value);

        if (result.success) {
            codeTextarea.classList.remove('has-error');
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
        } else {
            codeTextarea.classList.add('has-error');
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Erro: ' + result.error;
        }
    }
}

function toggleCustomCode(id) {
    const content = document.getElementById('customCodeContent' + id);
    const icon = document.getElementById('toggleIcon' + id);
    const header = content.parentElement.querySelector('.custom-code-header');

    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▼';
        icon.classList.add('expanded');
        header.classList.add('active');
    } else {
        content.style.display = 'none';
        icon.textContent = '▶';
        icon.classList.remove('expanded');
        header.classList.remove('active');
    }
}

function removeElement(id) {
    document.getElementById(`element-${id}`).remove();
    const root = document.getElementById('elements');
    const elements = root.querySelectorAll(':scope > div');
    elements.forEach((e, i) => {
        e.id = `element-${i}`;
        e.querySelector('button').onclick = () => removeElement(i);
        const elementsInput = root.querySelectorAll(`#element-${i} input`);
        elementsInput.forEach(input => {
            input.id = input.id.substring(0,1) + i;
            input.onchange = () => animation(i);
            input.onkeypress = () => animation(i);
        });

        const textarea = e.querySelector('textarea');
        if (textarea) {
            textarea.id = 'customCode' + i;
            textarea.onchange = () => updateCustomCode(i);
        }

        const errorDiv = e.querySelector('.code-error');
        if (errorDiv) {
            errorDiv.id = 'codeError' + i;
        }

        const codeContent = e.querySelector('.custom-code-content');
        if (codeContent) {
            codeContent.id = 'customCodeContent' + i;
        }
        const toggleIcon = e.querySelector('.toggle-icon');
        if (toggleIcon) {
            toggleIcon.id = 'toggleIcon' + i;
        }
        const header = e.querySelector('.custom-code-header');
        if (header) {
            header.onclick = () => toggleCustomCode(i);
        }
    });

    objectsToDraw.splice(id, 1);
    numberOfElements--;
}

document.querySelector(".button").addEventListener("click", function() {
    toggleSidebar();
});

document.addEventListener("keyup", function(e) {
    if (e.key === "Escape" || e.code === "Escape") {
        toggleSidebar();
    }
});

if (!gl) {
    console.error('WebGL não está disponível.');
}

class DrawableObject {
    constructor(vertices, colors, drawType, translation = {x: 0, y: 0}, rotation = 0, scale = {x: 1, y: 1}, animation = {x: 0, y: 0, ex: 0, ey: 0, r: 0}, customCode = '') {
        this.vertices = vertices;
        this.colors = colors;
        this.drawType = drawType;
        this.translation = translation;
        this.rotation = rotation;
        this.scale = scale;
        this.animation = animation;
        this.customCode = customCode;
        this.customCodeFunction = null;
        this.lastCompileError = null;
        this.lastExecutionError = null;
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

    setAnimation(x, y, ex, ey, r) {
        this.animation.x = x;
        this.animation.y = y;
        this.animation.ex = ex;
        this.animation.ey = ey;
        this.animation.r = r;
    }

    setCustomCode(code) {
        this.customCode = code;

        if (!code || code.trim() === '') {
            this.customCodeFunction = null;
            this.lastCompileError = null;
            return { success: true };
        }

        try {
            this.customCodeFunction = new Function('object', 'angle', code);
            this.lastCompileError = null;
            return { success: true };
        } catch (e) {
            console.error('Erro ao compilar código customizado:', e);
            this.customCodeFunction = null;
            this.lastCompileError = e.message;
            return { success: false, error: e.message };
        }
    }

    executeCustomCode(angle) {
        if (this.customCodeFunction) {
            try {
                this.customCodeFunction(this, angle);
                this.lastExecutionError = null;
            } catch (e) {
                if (this.lastExecutionError !== e.message) {
                    console.error('Erro ao executar código customizado:', e);
                    this.lastExecutionError = e.message;
                }
            }
        }
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
        uniform bool isCenter;

        void main() {
            vec2 position = a_position;
            vec2 pivot;

            if (isCenter) {
                pivot = u_center + u_translation;
            } else {
                pivot = vec2(0.0, 0.0);
            }

            position = position + u_translation;

            position = position - pivot;

            float cosRot = cos(u_rotation);
            float sinRot = sin(u_rotation);
            position = vec2(
                position.x * cosRot - position.y * sinRot,
                position.x * sinRot + position.y * cosRot
            );
        
            position = position * u_scale;        

            position = position + pivot;

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

    const isCenter = gl.getUniformLocation(shaderProgram, "isCenter");
    gl.uniform1f(isCenter, isCentering);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.colors), gl.STATIC_DRAW);

    const colorAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_color');
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);    
    
    gl.drawArrays(object.drawType, 0, object.vertices.length / 2);
}

function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    runAnimation();

    objectsToDraw.forEach(object => {
        object.executeCustomCode(angle);
    });

    angle += 0.02;

    objectsToDraw.forEach(drawObject);
    requestAnimationFrame(render);
}

function runAnimation() {
    for(let object of objectsToDraw) {
        let currentX = object.translation.x + object.animation.x;
        let currentY = object.translation.y + object.animation.y;
        let currentEX = object.scale.x + object.animation.ex;
        let currentEY = object.scale.y + object.animation.ey;
        let currentR = object.rotation + object.animation.r;

        object.setTranslation(currentX, currentY);
        object.setScale(currentEX, currentEY);
        object.setRotation(currentR);
    }
}

function calculateCenter(vertices) {
    let sumX = 0, sumY = 0;
    for (let i = 0; i < vertices.length; i += 2) {
        sumX += vertices[i];
        sumY += vertices[i + 1];
    }
    return { x: sumX / (vertices.length / 2), y: sumY / (vertices.length / 2) };
}



const shaderProgram = initWebGL();
render();
