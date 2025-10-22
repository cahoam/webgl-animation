const elementoWebGL = (id) => `
    <div class="element" id="element-${id}">
        <div class="form-line">
            <div class="form-group">
                <span>X</span>
                <input class="form-field" type="number" value="0" min="-1" step="0.01" id="x${id}" onkeypress="animation(${id})" onchange="animation(${id})">
            </div>
            <div class="form-group">
                <span>Y</span>
                <input class="form-field" type="number" value="0" min="-1" step="0.01" id="y${id}" onkeypress="animation(${id})" onchange="animation(${id})">
            </div>    
            <div class="form-group">
                <span>E</span>
                <input class="form-field" type="number" value="0" min="-1" step="0.01" id="e${id}" onkeypress="animation(${id})" onchange="animation(${id})">
            </div>    
        </div>
        <div class="form-line">
            <div class="form-group">
                <span>R</span>
                <input class="form-field" type="number" value="0" min="-1" step="0.01" id="r${id}" onkeypress="animation(${id})" onchange="animation(${id})">
            </div>
            <div class="form-group">
                <span>K</span>
                <input class="form-field" type="number" value="0" min="-1" step="0.01" id="k${id}" onkeypress="animation(${id})" onchange="animation(${id})">
            </div>    
            <button class="delete-element" onClick="removeElement(${id})">
                <img src="./assets/icon-delete.svg" height="20"/>
            </button>
        </div>
    </div>
`;

const poligons = {
    tri: [
        0, 0.26,
        -0.23, -0.13,
        0.23, -0.13
    ],
    sqr: [
        0.2, .2,
        0.2, -.2,
        -0.2, -.2,
        -0.2, .2
    ],
    pen: [
        0.2, 0.0,
        0.0618033988749895, 0.1902113032590307,
        -0.16180339887498948, 0.11755705045849463,
        -0.1618033988749895, -0.1175570504584946,
        0.06180339887498948, -0.1902113032590307
    ],
    hex: [
        0.2, 0.0,
        0.1, 0.1732050807568,
        -0.1, 0.173205080756,
        -0.2, 0.000449293598,
        -0.1, -0.17320508075,
        0.1, -0.173205080756
    ]
}
