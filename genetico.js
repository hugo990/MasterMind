poblacionInicial = 50;
pobInicial = Array();
tamGenes = 4;
colores = ["Rojo", "Azul", "Verde", "Amarillo", "Naranja", "Morado"];
codigo = generaCodigo();
generacion = 0;

console.log(codigo);
/**
 * Cromosoma
 * @type {{gen: any[]}}
 */
function cromosoma(numGenes) {
    this.gen = Array(); //Representacion
    this.blancas = 0; //Bolas que estan en el codigo pero no en la posicion correcta
    this.negras = 0; //Bolas en la posicion correcta
    this.fitness = 0; //Evaluacion
    this.n = 0; //Numero total de bolas

}

/**
 * Genera la poblacion inicial
 * @param cromosoma
 */
function generaPoblacion() {
    for(let i = 0; i < poblacionInicial; i++) {
        pobInicial[i] = new cromosoma(tamGenes);
        for(let j = 0; j < tamGenes; j++) {
            pobInicial[i].gen[j] = Math.floor(Math.random() * colores.length) + 1;
        }
    }

}

/**
 * Genera el codigo a descifrar (Objetivo)
 * @returns {any[]}
 */
function generaCodigo() {
    let codigo = Array();
    for(let i = 0; i < tamGenes; i++) {
        codigo.push(Math.floor(Math.random() * colores.length) + 1);
    }
    return codigo;
}

/**
 * Fitness
 * @param cromosoma
 */
function fitness(cromosoma) {
    let sum = 0, fitness;
    //Suma desde k = 1 hasta n - 1
    for(let k = 1; k < cromosoma.n - 1; k++) {
        sum += 1;
    }
    fitness = (2*cromosoma.negras + cromosoma.blancas) +sum;
    cromosoma.fitness = fitness;
}

/**
 * Indica las bolas blancas y negras
 * Las negras indican si la bola de color esta en la posicion correcta
 * Las bolas blancas indican si alguna bola de color esta en el codigo pero en la posicion incorrecta
 * @param cromosoma
 */
function buenCamino(cromosoma) {
    let gen = llenaCromosomaAuxiliar(cromosoma);
    let cod = llenaCodigoAuxiliar();
    //Se comprueba si hay bolitas de colores en la posicion correcta
    for(let i = 0; i < tamGenes; i++) {
        if(gen[i] == codigo[i]) {
            cod.splice(i, 1);
            gen.splice(i, 1);
            cromosoma.negras += 1;
            cromosoma.n += 1;
        }
    }
    //Se comprueba si hay bolitas de colores en el gen que no estan en la posicion correcta
    for(let i = 0; i < cod.length; i++) {
        if(cod.includes(gen[i])) {
            gen.splice(i, 1);
            cromosoma.n += 1;
            cromosoma.blancas += 1;
        }
    }
}

/**
 * Llena un cromosoma auxiliar
 * @param cromosoma
 */
function llenaCromosomaAuxiliar(cromosoma) {
    let cromosomaAux = Array();
    for(let i = 0; i < tamGenes; i++) {
        cromosomaAux.push(cromosoma.gen[i]);
    }
    return cromosomaAux;
}

/**
 * llena un codigo auxiliar
 */
function llenaCodigoAuxiliar() {
    let codigoAux = Array();
    for(let i = 0; i < tamGenes; i++) {
        codigoAux.push(codigo[i]);
    }
    return codigoAux;
}

/**
 * Fitness de la poblacion actual
 */
function fitnessPoblacion() {
    for(let i = 0; i < pobInicial.length; i++) {
        buenCamino(pobInicial[i]);
        fitness(pobInicial[i]);
    }
}

/**
 * Selecciona las mejores combinaciones
 * @param fitness
 * @param poblacion
 * @returns {any[]}
 */
 function seleccion(fitness, poblacion) {
    let seleccionados = Array();
    for(let i = 0; i < poblacion.length; i++) {
        if(poblacion[i].fitness >= fitness) {
            seleccionados.push(poblacion[i]);
        }
    }
    return seleccionados;
}

/**
 * Cruza las mejores combinaciones
 */
function cruza() {
    let mejores = Array();
    let hijos = Array();
    mejores = seleccion(1, pobInicial);
    mejores = eliminarImpar(mejores);
    for(let i = 0; i < mejores.length; i += 2) {
        let hijo = new cromosoma(tamGenes);
        let hijo2 = new cromosoma(tamGenes);
        //Cruza la parte inicial del padre y la parte final de la madre
        hijo.gen = partePadre(mejores[i]).gen.concat(parteMadre(mejores[i + 1]).gen);
        console.log(mejores[i + 1].gen.concat(mejores[i]).gen);
        hijos.push(hijo);
        hijos.push(hijo2);
    }
    return hijos;
}

/**
 * Hace que la poblacion sea par, en caso de no serlo
 * @param poblacion
 */
function eliminarImpar(poblacion) {
    if((poblacion.length % 2) != 0) {
        poblacion.pop();
    }
    return poblacion;
}

/**
 * Devuelve los primeros dos elementos de la connfiguracion del padre
 */
function partePadre(cromosoma) {
    cromosoma.gen.pop();
    cromosoma.gen.pop();
    return cromosoma;
}

/**
 * Devuelve los ultimos dos elementos de la connfiguracion de la madre
 */
function parteMadre(cromosoma) {
    cromosoma.gen.shift();
    cromosoma.gen.shift();
    return cromosoma;
}


function buscarSolucion() {
    let solEncontrada = false;
    let objetivo = generaCodigo();
    generaPoblacion();
    while(solEncontrada == false) {
        fitnessPoblacion();
        console.log(pobInicial);
        if(generacion > 0) {
            for(let i = 0; i < pobInicial.length; i++) {
                if(JSON.stringify(pobInicial[i].gen) == JSON.stringify(objetivo)) {
                    solEncontrada = true;
                    return 0;
                }
            }
        }
        pobInicial = seleccion(2, pobInicial);
        console.log(pobInicial);
        pobInicial = cruza();
        console.log(pobInicial);
        generacion++;
        console.log(generacion);
        console.log("Aun no se encuentra la solucion");
    }
}
