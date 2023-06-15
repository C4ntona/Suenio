// Obtener el contenedor y la lista de enlaces
const contenedorMapaSitio = document.getElementById('mapa-sitio');
const listaEnlaces = document.getElementById('lista-enlaces');

// Obtener todos los enlaces de la página
const enlaces = document.getElementsByTagName('a');

// Recorrer los enlaces y agregarlos a la lista
for (let i = 0; i < enlaces.length; i++) {
  const enlace = enlaces[i];
  const textoEnlace = enlace.textContent;
  const urlEnlace = enlace.href;

  // Crear un elemento de lista y enlace dentro de la lista
  const elementoLista = document.createElement('li');
  const elementoEnlace = document.createElement('a');
  elementoEnlace.textContent = textoEnlace;
  elementoEnlace.href = urlEnlace;

  elementoLista.appendChild(elementoEnlace);
  listaEnlaces.appendChild(elementoLista);
}

// Agregar el mapa del sitio al documento
document.body.appendChild(contenedorMapaSitio);
