const elementoWebGL = (id) => `
    <div class="element" id="element-${id}">
        <div class="form-line">
            <div class="form-group">
                <span>A</span>
                <input class="form-field" type="number" value="0" min="0">
            </div>
            <div class="form-group">
                <span>L</span>
                <input class="form-field" type="number" value="0" min="0">
            </div>    
            <div class="form-group">
                <span>V</span>
                <input class="form-field" type="number" value="0" min="0">
            </div>    
        </div>
        <div class="form-line">
            <div class="form-group">
                <span>X</span>
                <input class="form-field" type="number" value="0" min="-1">
            </div>
            <div class="form-group">
                <span>Y</span>
                <input class="form-field" type="number" value="0" min="-1">
            </div>    
            <button class="delete-element" onClick="removeElement(${id})">
                <img src="./assets/icon-delete.svg" height="20"/>
            </button>
        </div>
    </div>
`;