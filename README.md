# jquery-vTag - v0.0.1
Una herramienta jQuery para validar formularios de forma sencilla

##Reglas que valida

* **[required]**:        Indica que el campo es obligatorio, si es input deberá rellenarse, select deberá elegirse una opción que no sea nula o vacía (normalmente la primera opción) y checkbox o radio que sea chequedado
* **[notwhitespaces]**:  Indica que el valor no puede contener espacios
* **[enum]**:            Indica que el valor debe estar dentro de una enumeración dada
* **[digits]**:          Indica que el valor deben ser solo digitos, además da la posibilidad de indicar el nº exacto de los mismos
* **[number]**:          Indica que el valor debe ser un nº válido
* **[rangenumbers]**:    Indica que el valor debe estar entre un rango numérico
* **[rangeletters]**:    Indica que el valor debe estar entre un rango de letras
* **[rangecharcode]**:   Indica que el valor debe estar entre un rango charcodes
* **[rangelength]**:     Indica que la longitud del valor debe estar entre un rango de longitud
* **[positive]**:        Indica que el valor debe ser un nº positivo
* **[negative]**:        Indica que el valor debe ser un nº negativo
* **[min]**:             Indica que el valor debe cumplir un mínimo, pudiendo ser numérico o fecha
* **[max]**:             Indica que el valor debe cumplir un máximo, pudiendo ser numérico o fecha
* **[minlength]**:       Indica que la longitud del valor debe ser mayor a una longitud dada
* **[maxlength]**:       Indica que la longitud del valor debe ser menor a una longitud dada
* **[equal]**:           Indica que el valor debe ser igual a un valor dado
* **[notequal]**:        Indica que el valor debe ser distinto a un valor dado
* **[startwith]**:       Indica que el valor debe comenzar por un valor dado
* **[endwith]**:         Indica que el valor debe terminar por un valor dado
* **[contain]**:         Indica que el valor debe contener un valor dado
* **[notcontain]**:      Indica que el valor no debe contener un valor dado
* **[regexp]**:          Indica que el valor debe ser validado contra una expresión regular dada
* **[date]**:            Indica que el valor debe er una fecha válida
* **[time]**:            Indica que el valor debe ser una hora válida
* **[datetime]**:        Indica que el valor debe ser una fecha y hora válida
* **[customdate]**:      Indica que el valor debe cumplir un formato específico dado
* **[email]**:           Indica que el valor debe ser un email válido
* **[url]**:             Indica que el valor debe ser una url válida
* **[phonenumber]**:     Indica que el valor debe ser un nº de teléfono válido, validando finalmente (después de retirar paréntesis, guiones y espacios en blanco), que sea un nº de 9 cifras y que empieza por 6, 7, 8 ó 9

##Cómo usar

jQuery vTag Hace uso de jQuery, por tanto necesitamos hacer uso de esta librería.

Debemos linkear jQuery vTag después de la importación de jQuery:

```html
<script src="<path>/jquery-vTag.js"></script>
```

Para validar un formulario tan solo deberemos hacer `.vTag()` al formulario. Ejemplo:

```javascript
$("#form1").vTag({
	resultCallback: function(result){
    	//go
    }
});
```

Se validarán todos aquellos elementos `input` y `select` dentro del formulario que tengan declarado el atributo `data-vtag` con alguna/s de las reglas especificadas (pueden ser varias separadas por `#`).

*Pendiente aquí descripción de implementación de reglas...*