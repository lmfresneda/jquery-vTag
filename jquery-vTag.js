/*
 *  jquery-vTag - v0.0.1
 *  A jQuery tool to validate form data so easy
 *  https://github.com/lmfresneda/jquery-vTag
 *
 *  Made by Luis Miguel F.
 *  Under MIT License (https://github.com/lmfresneda/jquery-vTag/blob/master/LICENSE)
 */
;(function ($) { 
    "use strict";

    $.vTag = {

        /**
         * Realiza validaciones de todo tipo según la regla especificada
         * Las reglas existentes actualmente son:
         *     [required]:        Indica que el campo es obligatorio, si es input deberá rellenarse, select deberá elegirse una opción que no sea nula o vacía (normalmente la primera opción) y checkbox o radio que sea chequedado
         *     [notwhitespaces]:  Indica que el valor no puede contener espacios
         *     [enum]:            Indica que el valor debe estar dentro de una enumeración dada
         *     [digits]:          Indica que el valor deben ser solo digitos, además da la posibilidad de indicar el nº exacto de los mismos
         *     [number]:          Indica que el valor debe ser un nº válido
         *     [rangenumbers]:    Indica que el valor debe estar entre un rango numérico
         *     [rangeletters]:    Indica que el valor debe estar entre un rango de letras
         *     [rangecharcode]:   Indica que el valor debe estar entre un rango charcodes
         *     [rangelength]:     Indica que la longitud del valor debe estar entre un rango de longitud
         *     [positive]:        Indica que el valor debe ser un nº positivo
         *     [negative]:        Indica que el valor debe ser un nº negativo
         *     [min]:             Indica que el valor debe cumplir un mínimo, pudiendo ser numérico o fecha
         *     [max]:             Indica que el valor debe cumplir un máximo, pudiendo ser numérico o fecha
         *     [minlength]:       Indica que la longitud del valor debe ser mayor a una longitud dada
         *     [maxlength]:       Indica que la longitud del valor debe ser menor a una longitud dada
         *     [equal]:           Indica que el valor debe ser igual a un valor dado
         *     [notequal]:        Indica que el valor debe ser distinto a un valor dado
         *     [startwith]:       Indica que el valor debe comenzar por un valor dado
         *     [endwith]:         Indica que el valor debe terminar por un valor dado
         *     [contain]:         Indica que el valor debe contener un valor dado
         *     [notcontain]:      Indica que el valor no debe contener un valor dado
         *     [regexp]:          Indica que el valor debe ser validado contra una expresión regular dada
         *     [date]:            Indica que el valor debe er una fecha válida
         *     [time]:            Indica que el valor debe ser una hora válida
         *     [datetime]:        Indica que el valor debe ser una fecha y hora válida
         *     [customdate]       Indica que el valor debe cumplir un formato específico dado
         *     [email]:           Indica que el valor debe ser un email válido
         *     [url]:             Indica que el valor debe ser una url válida
         *     [phonenumber]:     Indica que el valor debe ser un nº de teléfono válido, validando finalmente (después de retirar paréntesis, guiones y espacios en blanco), que sea un nº de 9 cifras y que empieza por 6, 7, 8 ó 9
         * Las cuales se pueden obtener como colección mediante $.vTag.getRules()
         * @param   {String}  strRule  Regla a validar
         * @param   {Object}  value    Valor a validar
         * @param   {Object}  campo    (Opcional) En el caso de la regla required, es necesario pasar el campo para recoger valores
         * @return  {Boolean}          true si pasa la validación, false en cualquier otro caso
         */
        rule: function (strRule, value, campo) {
            var ok = true,
                strRegla = this.getRule(strRule);
            var confirmMoment = function () {
                if (!moment) {
                    throw new Error($.fn.vTag.lang[$.fn.vTag.defaults.lang].moment_not_found);
                }
            }
            if (this.isRule(strRegla)) {
                switch (strRegla) {
                    case "required":
                        if ($(campo).is(":checkbox") || $(campo).is(":radio")) {
                            ok = $(campo).is(":checked");
                        } else {
                            if ($(campo).is("select")) {
                                ok = value != null && value != "";
                            } else {
                                ok = value != "";
                            }
                        }
                        break;
                    case "notwhitespaces":
                        ok = value.indexOf(" ") == -1;
                        break;
                    case "enum":
                        var enumerador = this.getArguments(strRule).split(",");

                        if ($.inArray($.trim(value), enumerador) == -1) {
                            ok = false;
                        }
                        break;
                    case "digits":
                        var regular = this.helper.RegExp.digits();
                        ok = regular.test(value);
                        if (ok && strRule.indexOf("(") > -1) {
                            var num = this.getArguments(strRule);
                            ok = value.length == num;
                        }
                        break;
                    case "number":
                        var regular = this.helper.RegExp.number();
                        ok = regular.test(value);
                        break;
                    case "rangenumbers":
                        var strRango = this.getArguments(strRule);
                        var min = $.trim(strRango.split(",")[0]),
                            max = $.trim(strRango.split(",")[1]);
                        ok = value >= parseInt(min) && value <= parseInt(max);
                        break;
                    case "rangeletters":
                        var strRango = this.getArguments(strRule);
                        var min = $.trim(strRango.split(",")[0]).charAt(0);
                        var max = $.trim(strRango.split(",")[1]).charAt(0);
                        var stRegexp = "^[" + min + "-" + max + "]$";
                        var regular = new RegExp(stRegexp);
                        ok = regular.test(value);
                        break;
                    case "rangecharcode":
                        var strRango = this.getArguments(strRule);
                        var min = $.trim(strRango.split(",")[0]),
                            max = $.trim(strRango.split(",")[1]),
                            nMin = 0,
                            nMax = 0,
                            nVal = 0;
                        for (var i = 0; i < min.length; i++) {
                            nMin += min.charCodeAt(i);
                        }
                        for (var e = 0; e < max.length; e++) {
                            nMax += max.charCodeAt(e);
                        }
                        for (var k = 0; k < value.length; k++) {
                            nVal += value.charCodeAt(k);
                        }
                        ok = nVal > min && nVal < nMax;
                        break;
                    case "rangelength":
                        var strRango = this.getArguments(strRule);
                        var rangos1 = $.trim(strRango.split(",")[0]);
                        var rangos2 = $.trim(strRango.split(",")[1]);
                        ok = value.length >= rangos1 && value.length <= rangos2;
                        break;
                    case "min":
                        //posibilidades:
                        //min(5)
                        //min((date|time|datetime);12/12/1980[;DD/MM/YYYY])
                        //  ej: min(date;12/12/1980;DD/MM/YYYY)
                        //      min(datetime;12/12/1980 12:30:00)
                        var argumentos = this.getArguments(strRule);
                        if (argumentos.split(";").length > 1) {
                            confirmMoment();
                            var tipo = argumentos.split(";")[0];
                            var formato = this.helper.Format[tipo];
                            var comparer = argumentos.split(";")[1];
                            if (argumentos.split(";").length > 2) {
                                //nos pasa formato
                                formato = argumentos.split(";")[2];
                            }
                            if (this.customdate(value, formato) && this.customdate(comparer, formato)) {
                                var d1 = moment(value, formato)._d;
                                var d2 = moment(comparer, formato)._d;
                                if (d1 && d2) {
                                    ok = d1.getTime() >= d2.getTime();
                                } else {
                                    ok = false;
                                }
                            } else {
                                ok = false;
                            }
                        } else {
                            if (this.number(value)) {
                                var minimo = parseFloat(argumentos);
                                if (parseFloat(value) < minimo) {
                                    ok = false;
                                }
                            } else {
                                ok = false;
                            }
                        }
                        break;
                    case "positive":
                        if (this.number(value)) {
                            if (parseFloat(value) <= 0) {
                                ok = false;
                            }
                        } else {
                            ok = false;
                        }
                        break;
                    case "max":
                        //posibilidades:
                        //max(5)
                        //max((date|time|datetime);12/12/1980[;DD/MM/YYYY])
                        //  ej: max(date;12/12/1980;DD/MM/YYYY)
                        //      max(datetime;12/12/1980 12:30:00)
                        var argumentos = this.getArguments(strRule);
                        if (argumentos.split(";").length > 1) {
                            confirmMoment();
                            var tipo = argumentos.split(";")[0];
                            var formato = this.helper.Format[tipo];
                            var comparer = argumentos.split(";")[1];
                            if (argumentos.split(";").length > 2) {
                                //nos pasa formato
                                formato = argumentos.split(";")[2];
                            }

                            if (this.customdate(value, formato) && this.customdate(comparer, formato)) {
                                var d1 = moment(value, formato)._d;
                                var d2 = moment(comparer, formato)._d;
                                if (d1 && d2) {
                                    ok = d1.getTime() <= d2.getTime();
                                } else {
                                    ok = false;
                                }
                            } else {
                                ok = false;
                            }
                        } else {
                            if (this.number(value)) {
                                var maximo = parseFloat(argumentos);
                                if (parseFloat(value) > maximo) {
                                    ok = false;
                                }
                            } else {
                                ok = false;
                            }
                        }
                        break;
                    case "negative":
                        if (this.number(value)) {
                            if (parseFloat(value) >= 0) {
                                ok = false;
                            }
                        } else {
                            ok = false;
                        }
                        break;
                    case "email":
                        var regular = this.helper.RegExp.email();
                        ok = regular.test(value);
                        break;
                    case "url":
                        var regular = this.helper.RegExp.url();
                        ok = regular.test(value);
                        break;
                    case "phonenumber":
                        var regular = this.helper.RegExp.phone();
                        value = value.replace(/ /g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/\-/g, "");
                        value = parseInt(value);
                        if (isNaN(value)) {
                            ok = false;
                        } else {
                            ok = regular.test(value);
                        }
                        break;
                    case "date":
                        if (strRule.indexOf("(") == -1) {
                            var regular = this.helper.RegExp.date();
                            ok = regular.test(value);
                        } else {
                            //valida formato fecha personalizado
                            confirmMoment();
                            ok = this.customdate(this.getRule(strRule), this.getArguments(strRule));
                        }
                        break;
                    case "time":
                        if (strRule.indexOf("(") == -1) {
                            var regular = this.helper.RegExp.time();
                            ok = regular.test(value);
                        } else {
                            //valida formato fecha personalizado
                            confirmMoment();
                            ok = this.customdate(this.getRule(strRule), this.getArguments(strRule));
                        }
                        break;
                    case "datetime":
                        if (strRule.indexOf("(") == -1) {
                            var regularDate = this.helper.RegExp.date();
                            var regularTime = this.helper.RegExp.time();
                            var date = value.split(" ")[0];
                            var time = value.split(" ")[1];
                            ok = regularDate.test(date) && regularTime.test(time);
                        } else {
                            //valida formato fecha personalizado
                            confirmMoment();
                            ok = this.customdate(this.getRule(strRule), this.getArguments(strRule));
                        }
                        break;
                    case "customdate":
                        //se hace uso de moment.js [http://momentjs.com/]
                        //se valida la combinación de estos formatos [http://momentjs.com/docs/#/parsing/string-format/] únicamente
                        //otros formatos pueden generar incoherencias
                        confirmMoment();
                        var format = this.getArguments(strRule);
                        var pf = moment(value, format)._pf;
                        if (pf == null || pf == undefined) {
                            ok = false;
                        } else {
                            ok = (pf.unusedTokens == null || pf.unusedTokens == undefined || pf.unusedTokens.length == 0) && (pf.unusedInput == null || pf.unusedInput == undefined || pf.unusedInput.length == 0);
                        }

                        break;
                    case "minlength":
                        var num = this.getArguments(strRule);
                        ok = value.length >= num;
                        break;
                    case "maxlength":
                        var num = this.getArguments(strRule);
                        ok = value.length <= num;
                        break;
                    case "equal":
                        var comparer = this.getArguments(strRule);
                        ok = value == comparer;
                        break;
                    case "notequal":
                        var comparer = this.getArguments(strRule);
                        ok = value != comparer;
                        break;
                    case "startwith":
                        var prefix = this.getArguments(strRule);
                        ok = value.substr(0, prefix.length) == prefix;
                        break;
                    case "endwith":
                        var suffix = this.getArguments(strRule);
                        ok = value.substr(value.length - suffix.length) == suffix;
                        break;
                    case "contain":
                        var comparer = this.getArguments(strRule);
                        ok = value.indexOf(comparer) > -1;
                        break;
                    case "notcontain":
                        var comparer = this.getArguments(strRule);
                        ok = value.indexOf(comparer) == -1;
                        break;
                    case "regexp":
                        var reg = this.getArguments(strRule);
                        var empiece = 0;
                        if (reg.indexOf("/") == 0) {
                            empiece = 1;
                        }
                        var terminacion = reg.length,
                            conFlag = false;
                        if (reg.indexOf("/", reg.length - 2) > 0) {
                            terminacion = reg.indexOf("/", reg.length - 2);
                            if (reg.length - terminacion == 2) {
                                conFlag = true;
                            } else if (reg.length - terminacion == 1) {
                                conFlag = false;
                            }
                        }

                        var nRegExp = reg.substring(empiece, terminacion);
                        var regular = null;
                        if (!conFlag) {
                            regular = new RegExp(nRegExp);
                        } else {
                            var flag = reg.substring(reg.indexOf("/", reg.length - 2), reg.length).replace(/\//g, "");
                            regular = new RegExp(nRegExp, flag);
                        }
                        ok = regular.test(value);
                        break;
                    default:
                        ok = false;
                }

            } else {
                throw new Error("vTag.valid.rule");
            }
            return ok;
        },

        /**
         * Devuelve una colección con todas las reglas permitidas
         * @return  {Array}  Colección de strRules permitidas
         */
        getRules: function () {
            return [
                "required",
                "notwhitespaces",
                "enum",
                "digits",
                "number",
                "rangenumbers",
                "rangeletters",
                "rangecharcode",
                "rangelength",
                "positive",
                "negative",
                "min",
                "max",
                "minlength",
                "maxlength",
                "equal",
                "notequal",
                "startwith",
                "endwith",
                "contain",
                "notcontain",
                "regexp",
                "date",
                "time",
                "datetime",
                "customdate",
                "email",
                "url",
                "phonenumber"
            ];
        },

        /**
         * Devuelve la parte de los argumentos de una regla
         * @param   {String}  strRule  - Regla con argumentos
         * @return  {String}           - Argumentos
         */
        getArguments: function (strRule) {
            if (strRule.indexOf("(") > -1) {
                return $.trim(strRule.substring(strRule.indexOf("(") + 1, strRule.length - 1));
            } else {
                return "";
            }
        },

        /**
         * Devuelve la regla sin argumentos
         * @param   {String}  strRule  - Regla con o sin argumentos
         * @return  {String}           - Regla sin argumentos
         */
        getRule: function (strRule) {
            return $.trim(strRule.split("(")[0]);
        },

        /**
         * Nos dice si una regla existe
         * @param   {String}   strRule  - Regla a comprobar
         * @return  {Boolean}           - true si existe, false en cualquier otro caso
         */
        isRule: function (strRule) {
            return $.inArray(this.getRule(strRule), this.getRules()) > -1;
        },

        /**
         * Valida que el valor no contenga espacios en blanco
         * @param   {String}    value   Valor a validar
         * @return  {Boolean}           true si pasa la validación, false en cualquier otro caso
         */
        notWhiteSpaces: function (value) {
            var rule = "notwhitespaces";
            return this.rule(rule, value);
        },

        /**
         * Valida que el valor sea alguno de los enumeradores pasados
         * @param   {String}    value   Valor a validar
         * @param   {Array}     arEnum  Enum
         * @return  {Boolean}           true si pasa la validación, false en cualquier otro caso
         */
        _enum: function (value, arEnum) {
            var rule = "enum(" + arEnum.join(",") + ")";
            return this.rule(rule, value);
        },

        /**
         * Valida que el valor sea solo números enteros
         * @param   {String}    value   Valor a validar
         * @param   {Number}    digits  (Opcional) Nº de digitos que debe tener el valor
         * @return  {Boolean}           true si pasa la validación, false en cualquier otro caso
         */
        digits: function (value, digits) {
            var rule = "digits";
            if (digits && this.rule("digits", digits)) {
                rule += "(" + digits + ")";
            }
            return this.rule(rule, value);
        },

        /**
         * Valida que el valor sea un número dentro del rango indicado
         * @param   {String}    value   Valor a validar
         * @param   {Number}    min     Nº mínimo del rango
         * @param   {Number}    max     Nº máximo del rango
         * @return  {Boolean}           true si pasa la validación, false en cualquier otro caso
         */
        rangenumbers: function (value, min, max) {
            var rule = "rangenumbers(" + min + "," + max + ")";
            return this.rule(rule, value);
        },

        /**
         * Valida que el valor sea una letra dentro del rango indicado
         * @param   {String}    value   Valor a validar
         * @param   {Number}    min     Letra/s mínima/s del rango
         * @param   {Number}    max     Letra/s mínima/s del rango
         * @return  {Boolean}           true si pasa la validación, false en cualquier otro caso
         */
        rangeletters: function (value, min, max) {
            var rule = "rangeletters(" + min + "," + max + ")";
            return this.rule(rule, value);
        },

        /**
         * Valida que la suma de los charcode de los caracteres del valor esté dentro del rango indicado,
         * siendo el rango cadenas de caracteres también
         * @param   {String}    value   Valor a validar
         * @param   {Number}    min     Códigos mínimos del rango
         * @param   {Number}    max     Códigos mínimos del rango
         * @return  {Boolean}           true si pasa la validación, false en cualquier otro caso
         */
        rangecharcode: function (value, min, max) {
            var rule = "rangecharcode(" + min + "," + max + ")";
            return this.rule(rule, value);
        },

        /**
         * Valida que la longitud del valor esté dentro del rango indicado
         * @param   {String}    value   Valor a validar
         * @param   {Number}    min     Nº mínimo del longitud
         * @param   {Number}    max     Nº máximo del longitud
         * @return  {Boolean}           true si pasa la validación, false en cualquier otro caso
         */
        rangelength: function (value, min, max) {
            var rule = "rangelength(" + min + "," + max + ")";
            return this.rule(rule, value);
        },

        /**
         * Valida que el valor sea mayor que el mínimo indicado
         * @param   {String}    value   Valor a validar
         * @param   {Number}    min     Nº mínimo
         * @return  {Boolean}           true si pasa la validación, false en cualquier otro caso
         */
        min: function (value, min) {
            var rule = "min(" + min + ")";
            return this.rule(rule, value);
        },

        /**
         * Valida que el valor sea menor que el máximo indicado
         * @param   {String}    value   Valor a validar
         * @param   {Number}    max     Nº máximo
         * @return  {Boolean}           true si pasa la validación, false en cualquier otro caso
         */
        max: function (value, max) {
            var rule = "max(" + max + ")";
            return this.rule(rule, value);
        },

        /**
         * Valida que el valor sea mayor que la fecha y/u hora indicada
         * @param   {String}    value       Valor a validar
         * @param   {String}    type        date|time|datetime Tipo de validación
         * @param   {String}    comparer    Valor contra el que se comparará
         * @param   {String}    format      (Opcional) Formato a seguir
         * @return  {Boolean}               true si pasa la validación, false en cualquier otro caso
         */
        minDate: function (value, type, comparer, format) {
            var rule = "min(" + type + ";" + comparer;
            if (format && format != "") {
                rule += ";" + format;
            }
            rule += ")";
            return this.rule(rule, value);
        },

        /**
         * Valida que el valor sea menor que la fecha y/u hora indicada
         * @param   {String}    value       Valor a validar
         * @param   {String}    type        date|time|datetime Tipo de validación
         * @param   {String}    comparer    Valor contra el que se comparará
         * @param   {String}    format      (Opcional) Formato a seguir
         * @return  {Boolean}               true si pasa la validación, false en cualquier otro caso
         */
        maxDate: function (value, type, comparer, format) {
            var rule = "max(" + type + ";" + comparer;
            if (format && format != "") {
                rule += ";" + format;
            }
            rule += ")";
            return this.rule(rule, value);
        },

        /**
         * Valida que el valor sea un número positivo
         * @param   {String}    value   Valor a validar
         * @return  {Boolean}           true si pasa la validación, false en cualquier otro caso
         */
        positive: function (value) {
            var rule = "positive";
            return this.rule(rule, value);
        },

        /**
         * Valida que el valor sea un número negativo
         * @param   {String}    value   Valor a validar
         * @return  {Boolean}           true si pasa la validación, false en cualquier otro caso
         */
        negative: function (value) {
            var rule = "negative";
            return this.rule(rule, value);
        },

        /**
         * Valida que el valor tenga una longitud mayor a la indicada
         * @param   {String}    value   Valor a validar
         * @param   {Number}    min     Nº mínimo de longitud
         * @return  {Boolean}           true si pasa la validación, false en cualquier otro caso
         */
        minlength: function (value, min) {
            var rule = "minlength(" + min + ")";
            return this.rule(rule, value);
        },

        /**
         * Valida que el valor tenga una longitud menor a la indicada
         * @param   {String}    value   Valor a validar
         * @param   {Number}    max     Nº máximo de longitud
         * @return  {Boolean}           true si pasa la validación, false en cualquier otro caso
         */
        maxlength: function (value, max) {
            var rule = "maxlength(" + max + ")";
            return this.rule(rule, value);
        },

        /**
         * Valida que dos valores sean iguales. 
         * IMPORTANTE: Se debe tener en cuenta que valida el valor y no el tipo
         * @param   {Object}    value       Valor a validar
         * @param   {Object}    comparer    Valor con el que comparar
         * @return  {Boolean}               true si pasa la validación, false en cualquier otro caso
         */
        equal: function (value, comparer) {
            var rule = "equal(" + comparer + ")";
            return this.rule(rule, value);
        },
        /**
         * Valida que dos valores no sean iguales. 
         * IMPORTANTE: Se debe tener en cuenta que valida el valor y no el tipo
         * @param   {Object}    value       Valor a validar
         * @param   {Object}    comparer    Valor con el que comparar
         * @return  {Boolean}               true si pasa la validación, false en cualquier otro caso
         */
        notEqual: function (value, comparer) {
            var rule = "notequal(" + comparer + ")";
            return this.rule(rule, value);
        },
        /**
         * Valida un valor comienza con otro. 
         * IMPORTANTE: Se debe tener en cuenta que valida el valor y no el tipo
         * @param   {Object}    value       Valor a validar
         * @param   {Object}    prefix      Valor con el que comparar
         * @return  {Boolean}               true si pasa la validación, false en cualquier otro caso
         */
        startWith: function (value, prefix) {
            var rule = "startwith(" + prefix + ")";
            return this.rule(rule, value);
        },
        /**
         * Valida un valor termina con otro. 
         * IMPORTANTE: Se debe tener en cuenta que valida el valor y no el tipo
         * @param   {Object}    value       Valor a validar
         * @param   {Object}    prefix      Valor con el que comparar
         * @return  {Boolean}               true si pasa la validación, false en cualquier otro caso
         */
        endWith: function (value, suffix) {
            var rule = "endwith(" + suffix + ")";
            return this.rule(rule, value);
        },
        /**
         * Valida un valor contiene otro. 
         * IMPORTANTE: Se debe tener en cuenta que valida el valor y no el tipo
         * @param   {Object}    value       Valor a validar
         * @param   {Object}    comparer    Valor con el que comparar
         * @return  {Boolean}               true si pasa la validación, false en cualquier otro caso
         */
        contain: function (value, comparer) {
            var rule = "contain(" + comparer + ")";
            return this.rule(rule, value);
        },
        /**
         * Valida un valor no contiene otro. 
         * IMPORTANTE: Se debe tener en cuenta que valida el valor y no el tipo
         * @param   {Object}    value       Valor a validar
         * @param   {Object}    comparer    Valor con el que comparar
         * @return  {Boolean}               true si pasa la validación, false en cualquier otro caso
         */
        notContain: function (value, comparer) {
            var rule = "notcontain(" + comparer + ")";
            return this.rule(rule, value);
        },
        /**
         * Valida un email
         * @param   {String}  emailText
         * @return  {Boolean}
         */
        email: function (emailText) {
            return this.rule("email", emailText);
        },

        /**
         * Valida una url
         * @param   {String}  url
         * @return  {Boolean}
         */
        url: function (url) {
            return this.rule("url", url);
        },

        /**
         * Valida un teléfono 
         * @param   {String}  url
         * @return  {Boolean}
         */
        phonenumber: function (phone) {
            return this.rule("phonenumber", phone);
        },

        /**
         * Valida que sea un número
         * @param   {String}  n
         * @return  {Boolean}
         */
        number: function (n) {
            return this.rule("number", n);
        },

        /**
         * Validamos el formato de una fecha como dd(/|-)MM(/|-)YYYY
         * @param   {String}  dateString 
         * @return  {Boolean} 
         */
        date: function (dateString) {
            return this.rule("date", dateString);
        },

        /**
         * Validamos el formato de una hora como hh:mm[:ss]
         * @param   {String}  timeString 
         * @return  {Boolean} 
         */
        time: function (timeString) {
            return this.rule("time", timeString);
        },

        /**
         * Validamos el formato de una fecha y hora completa como dd(/|-)MM(/|-)YYYY hh:mm[:ss]
         * @param   {String}  timeString 
         * @return  {Boolean} 
         */
        dateTime: function (dateTimeString) {
            return this.rule("datetime", dateTimeString);
        },

        /**
         * Valida que la fecha, hora o una combinación de ellas cumpla con el formato indicado
         * @param   {String}    value   Valor a validar
         * @param   {String}    format  Formato a comparar (debe ser formatos válidos en {@link http://momentjs.com/docs/#/parsing/string-format/}) 
         * @return  {Boolean}           true si pasa la validación, false en cualquier otro caso
         */
        customdate: function (value, format) {
            var rule = "customdate(" + format + ")";
            return this.rule(rule, value);
        },

        /**
         * Borra visualmente todas las validaciones erróneas
         */
        clearValidations: function () {
            $("*").removeClass("validation");
        },

        /**
         * Helper con expresiones regulares varias
         * @type  {Object}
         */
        helper: {
            RegExp: {
                email: function () { return new RegExp(/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/); },
                url: function () { return new RegExp(/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i); },
                number: function () { return new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/); },
                date: function () { return new RegExp(/^(((0[1-9]|[12][0-9]|3[01])([/-])(0[13578]|10|12)([/-])(\d{4}))|(([0][1-9]|[12][0-9]|30)([/-])(0[469]|11)([/-])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([/-])(02)([/-])(\d{4}))|((29)(\.|-|\/)(02)([/-])([02468][048]00))|((29)([/-])(02)([/-])([13579][26]00))|((29)([/-])(02)([/-])([0-9][0-9][0][48]))|((29)([/-])(02)([/-])([0-9][0-9][2468][048]))|((29)([/-])(02)([/-])([0-9][0-9][13579][26])))$/); },
                time: function () { return new RegExp(/^((0[0-9]|1[0-9]|2[0-4])([:])([0-5][0-9])|(0[0-9]|1[0-9]|2[0-4])([:])([0-5][0-9])([:])([0-5][0-9]))$/); },
                digits: function () { return new RegExp(/^\d+$/); },
                phone: function () { return new RegExp(/^([6789]\d{8})$/); }
            },
            Format: {
                date: "DD/MM/YYYY",
                time: "HH:mm:ss",
                datetime: "DD/MM/YYYY HH:mm:ss"
            }
        }
    };

    $.fn.vTag = function (settings) {
        settings = settings || {};
        var settings = $.extend({}, $.fn.vTag.defaults, settings);
        if (!String.__format) {
            String.__format = function () {
                var s = arguments[0];
                for (var i = 0; i < arguments.length - 1; i++) {
                    var reg = new RegExp("\\{" + i + "\\}", "gm");
                    s = s.replace(reg, arguments[i + 1]);
                }
                return s;
            };
        }

        var addClass = function (clases, campo, resultado) {
            if (resultado && clases.ok) {
                $(campo).addClass(clases.ok);
                if (clases.error) { $(campo).removeClass(clases.error); }
            } else if (!resultado && clases.error) {
                $(campo).addClass(clases.error);
                if (clases.ok) { $(campo).removeClass(clases.ok); }
            }
        }

        var addVisibleResult = function (settings, campo, resultado) {
            $(campo).siblings("span").filter(".vtag-ok, .vtag-error").remove();
            if (resultado && settings.visible_result.ok) {
                var str = $(campo).attr('data-vtag-ok') ?
                          $(campo).attr('data-vtag-ok') :
                          $.fn.vTag.lang[settings.lang].str_ok;
                var strSpan = settings.visible_format
                            .replace(/\$STYLE_RESULT/g, settings.styles.str_ok)
                            .replace(/\$MSG_RESULT/g, str);
                $(strSpan).insertAfter(campo).addClass("vtag-ok");
            } else if (!resultado && settings.visible_result.error) {
                var str = $(campo).attr('data-vtag-error') ?
                          $(campo).attr('data-vtag-error') :
                          $.fn.vTag.lang[settings.lang].str_error;
                var strSpan = settings.visible_format
                            .replace(/\$STYLE_RESULT/g, settings.styles.str_error)
                            .replace(/\$MSG_RESULT/g, str);
                $(strSpan).insertAfter(campo).addClass("vtag-error");
            }
        }

        return this.each(function () {
            var $form = $(this);
            var campos = $form.find("input[data-vtag], select[data-vtag]").toArray();
            
            var resultados = [];

            for (var i = 0; i < campos.length; i++) {
                var campo = campos[i];
                var reglas = $(campo).attr('data-vtag').split("#");
                var resultado = true,
                    str = "";
                for (var k = 0; k < reglas.length; k++) {
                    var regla = reglas[k],
                        strRegla = $.vTag.getRule(regla),
                        ok = true;
                    ok = $.vTag.rule(regla, $(campo).val(), campo);

                    if (!ok) {
                        resultado = ok;
                        break;
                    }
                };

                if (settings.classes) {
                    addClass(settings.classes, campo, resultado);
                }
                addVisibleResult(settings, campo, resultado);

                if (!ok) {
                    str = $(campo).attr('data-vtag-error') ? $(campo).attr('data-vtag-error') : str;
                } else {
                    str = $(campo).attr('data-vtag-ok') ? $(campo).attr('data-vtag-ok') : str;
                }
                resultados.push({ field: campo, result: resultado, txt_error: str });

            };

            if (settings.resultCallback && $.isFunction(settings.resultCallback)) {
                settings.resultCallback(resultados);
            }
        });

    };

    $.fn.vTag.defaults = {
        lang: "es",
        visible_result: {
            ok: false,
            error: false
        },
        visible_format: "<span style='$STYLE_RESULT'>$MSG_RESULT</span>",
        styles: {
            str_ok: "color: #07E461; margin: 2px;",
            str_error: "color: #F95A5A; margin: 2px;"
        }
    };
    $.fn.vTag.lang = {};
    $.fn.vTag.lang["es"] = {
        str_ok: "Campo validado",
        str_error: "Campo no válido",
        moment_not_found: "Librería 'moment.js' no encontrada. Visite http://momentjs.com/"
    };

})(jQuery);

