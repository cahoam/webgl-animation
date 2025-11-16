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
                <img src="../assets/icon-delete.svg" height="20"/>
            </button>
        </div>
        <div class="custom-code-section">
            <div class="custom-code-header" onclick="toggleCustomCode(${id})">
                <span class="custom-code-title">
                    <span class="toggle-icon" id="toggleIcon${id}">▶</span>
                    Anime com Código Customizado (JS)
                </span>
            </div>
            <div class="custom-code-content" id="customCodeContent${id}" style="display: none;">
                <textarea
                    id="customCode${id}"
                    class="custom-code-textarea"
                    placeholder="Ex: object.setRotation(Math.sin(angle) * 0.5);"
                    onchange="updateCustomCode(${id})"
                    rows="4"
                ></textarea>
                <div class="code-hint">
                    <strong>Variáveis:</strong> <code>object</code>, <code>angle</code><br>
                    <strong>Métodos:</strong> <code>setTranslation(x, y)</code>, <code>setRotation(r)</code>, <code>setScale(x, y)</code>
                </div>
            </div>
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
