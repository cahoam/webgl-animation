const elementoWebGL = (id) => `
    <div class="element" id="element-${id}">
        <div class="form-line">
            <div class="form-group">
                <span>X</span>
                <input class="form-field" type="number" value="0" min="-1" step="0.01" id="x${id}"
                       title="Translação no eixo X"
                       onkeypress="animation(${id})" onchange="animation(${id})">
            </div>
            <div class="form-group">
                <span>Y</span>
                <input class="form-field" type="number" value="0" min="-1" step="0.01" id="y${id}"
                       title="Translação no eixo Y"
                       onkeypress="animation(${id})" onchange="animation(${id})">
            </div>    
            <div class="form-group">
                <span>E</span>
                <input class="form-field" type="number" value="0" min="-1" step="0.01" id="e${id}"
                       title="Escala"
                       onkeypress="animation(${id})" onchange="animation(${id})">
            </div>    
        </div>
        <div class="form-line">
            <div class="form-group">
                <span>R</span>
                <input class="form-field" type="number" value="0" min="-1" step="0.01" id="r${id}"
                       title="Rotação"
                       onkeypress="animation(${id})" onchange="animation(${id})">
            </div>
            <button class="delete-element" onClick="removeElement(${id})" title="Remover objeto">
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
                <div class="code-error" id="codeError${id}" style="display: none;"></div>
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
        0.3, 0.56,
        0.07, 0.17,
        0.53, 0.17
    ],
    sqr: [
        0.5, 0.5,
        0.5, 0.1,
        0.1, 0.1,
        0.1, 0.5
    ],
    pen: [
        0.5, 0.3,
        0.3618033988749895, 0.4902113032590307,
        0.13819660112501052, 0.41755705045849463,
        0.1381966011250105, 0.1824429495415054,
        0.36180339887498947, 0.1097886967409693
    ],
    hex: [
        0.5, 0.3,
        0.4, 0.4732050807568,
        0.2, 0.473205080756,
        0.1, 0.300449293598,
        0.2, 0.12679491925,
        0.4, 0.126794919244
    ]
}
